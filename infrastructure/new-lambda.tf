data "archive_file" "lambda" {
  type       = "zip"
  source_dir = "${path.root}/${var.source_dir}"
  # ^ using `source_dir` instead of `source_file` to have external dependencies (`node_modules`) in package
  # https://developer.hashicorp.com/terraform/language/expressions/references#path-root
  output_path = "${var.function_name}.zip"
}
# https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file

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
  default = "app-get"
}

variable "memory_size" {
  type    = string
  default = 128
}

variable "timeout" {
  type    = string
  default = "3"
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
