data "archive_file" "lambda" {
  type       = "zip"
  source_dir = "${path.root}/${var.source_dir}"
  # ^ using `source_dir` instead of `source_file` to have external dependencies (`node_modules`) in package
  # https://developer.hashicorp.com/terraform/language/expressions/references#path-root
  output_path = "${var.function_name}.zip"
}
# https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file

resource "aws_security_group" "lambda_sg" {
  name        = "lambda-sg"
  description = "Security group for Lambda functions"
  vpc_id      = var.BLOG_TLDRLW_VPC_ID
  ingress {
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [aws_security_group.api_gateway_sg.id]
    description     = "Allow traffic from API Gateway"
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic (e.g., calls to external services like S3, DynamoDB)"
  }
}

resource "aws_lambda_function" "my_lambda" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename         = "${var.function_name}.zip"
  function_name    = var.function_name
  role             = aws_iam_role.lambda.arn
  handler          = "${var.handler_file_prefix}.lambdaHandler"
  source_code_hash = data.archive_file.lambda.output_base64sha256
  runtime          = "nodejs20.x"
  memory_size      = var.memory_size
  timeout          = var.timeout
  environment {
    variables = {
      DYDB_TABLE_NAME = aws_dynamodb_table.insights.id,
      REGION          = var.REGION
      LIMIT           = 60
    }
  }
  vpc_config {
    # Every subnet should be able to reach an EFS mount target in the same Availability Zone. Cross-AZ mounts are not permitted.
    subnet_ids         = aws_subnet.private[*].id
    security_group_ids = [aws_security_group.lambda_sg.id]
  }
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function

variable "source_dir" {
  type    = string
  default = "lambda"
}

variable "function_name" {
  type    = string
  default = "monza-tldrlw-get-test"
}

variable "handler_file_prefix" {
  type    = string
  default = "app-get-test"
}

variable "memory_size" {
  type    = string
  default = 1028
}

variable "timeout" {
  type    = string
  default = "5"
}

# assume role policy
data "aws_iam_policy_document" "lambda_assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

# role
resource "aws_iam_role" "lambda" {
  name               = var.function_name
  path               = "/lambda/"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role

# dydb policy
data "aws_iam_policy_document" "lambda_to_dydb" {
  statement {
    effect    = "Allow"
    actions   = ["dynamodb:Scan", "dynamodb:DescribeTable"]
    resources = [aws_dynamodb_table.insights.arn]
  }
}

resource "aws_iam_policy" "lambda_to_dydb" {
  name   = "${var.function_name}-to-dydb"
  path   = "/lambda/"
  policy = data.aws_iam_policy_document.lambda_to_dydb.json
}

resource "aws_iam_role_policy_attachment" "lambda_to_dydb" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.lambda_to_dydb.arn
}

# cloudwatch policy
# See also the following AWS managed policy: AWSLambdaBasicExecutionRole
data "aws_iam_policy_document" "lambda_logging" {
  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function#cloudwatch-logging-and-permissions

resource "aws_iam_policy" "lambda_logging" {
  name        = "${var.function_name}-logging"
  path        = "/lambda/"
  description = "IAM policy for logging from a lambda"
  policy      = data.aws_iam_policy_document.lambda_logging.json
}

resource "aws_iam_role_policy_attachment" "lambda_logging" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

resource "aws_lambda_permission" "api_gateway_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.my_lambda.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.private_api.execution_arn}/*/*/*"
  # source_arn = "arn:aws:execute-api:${var.REGION}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.private_api.id}/*"
}

# EC2 permissions for Lambda to create and manage network interfaces
data "aws_iam_policy_document" "lambda_vpc_permissions" {
  statement {
    effect = "Allow"
    actions = [
      "ec2:CreateNetworkInterface",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DeleteNetworkInterface"
    ]
    resources = ["*"]
    # Lambda requires specific EC2 permissions when configured to run within a VPC. The ec2:CreateNetworkInterface permission is necessary for Lambda to create a network interface (ENI) in the VPC to facilitate function execution. The ec2:DescribeNetworkInterfaces permission is required to retrieve details about the network interface during execution, and the ec2:DeleteNetworkInterface permission allows Lambda to clean up the ENI after execution to avoid resource leaks.
  }
}

resource "aws_iam_policy" "lambda_vpc_permissions" {
  name        = "${var.function_name}-vpc-permissions"
  path        = "/lambda/"
  description = "IAM policy for Lambda to manage network interfaces in a VPC"
  policy      = data.aws_iam_policy_document.lambda_vpc_permissions.json
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_permissions" {
  role       = aws_iam_role.lambda.name
  policy_arn = aws_iam_policy.lambda_vpc_permissions.arn
}

output "aws_api_gateway_rest_api_private_api_execution_arn" {
  value = aws_api_gateway_rest_api.private_api.execution_arn
}
