data "archive_file" "drivers_update" {
  type       = "zip"
  source_dir = "${path.root}/${var.LAMBDA_PATH}"
  # ^ using `source_dir` instead of `source_file` to have external dependencies (`node_modules`) in package
  # https://developer.hashicorp.com/terraform/language/expressions/references#path-root
  output_path = "${var.APP_NAME}-drivers-update.zip"
}
# https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file

resource "aws_lambda_function" "drivers_update" {
  function_name    = "${var.APP_NAME}-drivers-update"
  handler          = "app-drivers-update.lambdaHandler" # Your Lambda's entrypoint
  runtime          = "nodejs20.x"                       # Adjust the runtime as necessary
  role             = aws_iam_role.lambda_drivers_update.arn
  filename         = "${var.APP_NAME}-drivers-update.zip" # The zipped Lambda code
  source_code_hash = data.archive_file.drivers_update.output_base64sha256
  environment {
    variables = {
      LAMBDA_GET_DRIVERS_FUNCTION_URL = module.lambda_get_drivers.function_url
      DRIVERS_DYDB_TABLE_NAME         = aws_dynamodb_table.drivers.id
      TEST_DYDB_TABLE_NAME            = aws_dynamodb_table.test.id
      REGION                          = var.REGION
    }
  }
  memory_size = 128
  # ^ default value, will get 128 without specifying
  timeout = 120
  # https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html#function-configuration-deployment-and-execution
}

resource "aws_lambda_event_source_mapping" "results_table_stream_trigger" {
  event_source_arn  = aws_dynamodb_table.results.stream_arn
  function_name     = aws_lambda_function.drivers_update.arn
  starting_position = "LATEST" # Adjust based on when you want the stream to start
}

data "archive_file" "constructors_update" {
  type       = "zip"
  source_dir = "${path.root}/${var.LAMBDA_PATH}"
  # ^ using `source_dir` instead of `source_file` to have external dependencies (`node_modules`) in package
  # https://developer.hashicorp.com/terraform/language/expressions/references#path-root
  output_path = "${var.APP_NAME}-constructors-update.zip"
}
# https://registry.terraform.io/providers/hashicorp/archive/latest/docs/data-sources/file

resource "aws_lambda_function" "constructors_update" {
  function_name    = "${var.APP_NAME}-constructors-update"
  handler          = "app-constructors-update.lambdaHandler" # Your Lambda's entrypoint
  runtime          = "nodejs20.x"                            # Adjust the runtime as necessary
  role             = aws_iam_role.lambda_constructors_update.arn
  filename         = "${var.APP_NAME}-constructors-update.zip" # The zipped Lambda code
  source_code_hash = data.archive_file.constructors_update.output_base64sha256
  environment {
    variables = {
      LAMBDA_GET_CONSTRUCTORS_FUNCTION_URL = module.lambda_get_constructors.function_url
      CONSTRUCTORS_DYDB_TABLE_NAME         = aws_dynamodb_table.constructors.id
      TEST_DYDB_TABLE_NAME                 = aws_dynamodb_table.test.id
      REGION                               = var.REGION
    }
  }
  memory_size = 128
  # ^ default value, will get 128 without specifying
  timeout = 120
  # https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html#function-configuration-deployment-and-execution
}

resource "aws_lambda_event_source_mapping" "results_table_stream_trigger" {
  event_source_arn  = aws_dynamodb_table.results.stream_arn
  function_name     = aws_lambda_function.constructors_update.arn
  starting_position = "LATEST" # Adjust based on when you want the stream to start
}
