data "aws_iam_policy_document" "lambda_drivers_update_assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lambda_drivers_update" {
  name               = "${var.APP_NAME}-lambda-drivers-update"
  path               = "/lambda/"
  assume_role_policy = data.aws_iam_policy_document.lambda_drivers_update_assume_role.json
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role

data "aws_iam_policy_document" "lambda_drivers_update" {
  statement {
    actions = [
      "dynamodb:DescribeStream",
      "dynamodb:GetRecords",
      "dynamodb:GetShardIterator",
      "dynamodb:ListStreams"
    ]
    resources = [
      aws_dynamodb_table.results.stream_arn
    ]
    effect = "Allow"
  }
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:*:*:*"]
    effect    = "Allow"
  }
  # Permissions to write to another DynamoDB table
  statement {
    actions = [
      "dynamodb:BatchWriteItem"
    ]
    resources = [
      aws_dynamodb_table.test.arn,
      aws_dynamodb_table.drivers.arn
    ]
    effect = "Allow"
  }
}

resource "aws_iam_policy" "lambda_drivers_update" {
  name   = "lambda_policy"
  policy = data.aws_iam_policy_document.lambda_drivers_update.json
}

resource "aws_iam_role_policy_attachment" "lambda_drivers_update" {
  role       = aws_iam_role.lambda_drivers_update.name
  policy_arn = aws_iam_policy.lambda_drivers_update.arn
}
