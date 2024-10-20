module "lambda_get" {
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-get"
  REST_method         = "GET"
  function_name       = "${var.APP_NAME}-get"
  environment_variables = {
    DYDB_TABLE_NAME = aws_dynamodb_table.insights.id,
    REGION          = var.REGION
    LIMIT           = 20
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.insights.arn
  dydb_table_permissions = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  function_url_public    = true
}

module "lambda_get_constructors" {
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-get-constructors"
  REST_method         = "GET"
  function_name       = "${var.APP_NAME}-get-constructors"
  environment_variables = {
    CONSTRUCTORS_DYDB_TABLE_NAME = aws_dynamodb_table.constructors.id,
    REGION                       = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.constructors.arn
  dydb_table_permissions = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  function_url_public    = true
}

module "lambda_get_drivers" {
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-get-drivers"
  REST_method         = "GET"
  function_name       = "${var.APP_NAME}-get-drivers"
  environment_variables = {
    DRIVERS_DYDB_TABLE_NAME = aws_dynamodb_table.drivers.id,
    REGION                  = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.drivers.arn
  dydb_table_permissions = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  function_url_public    = true
}

module "lambda_get_results" {
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-get-results"
  REST_method         = "GET"
  function_name       = "${var.APP_NAME}-get-results"
  environment_variables = {
    RESULTS_DYDB_TABLE_NAME = aws_dynamodb_table.results.id,
    REGION                  = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.results.arn
  dydb_table_permissions = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  function_url_public    = true
}

module "lambda_post" {
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-post"
  REST_method         = "POST"
  function_name       = "${var.APP_NAME}-post"
  environment_variables = {
    DYDB_TABLE_NAME = aws_dynamodb_table.insights.id,
    REGION          = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.insights.arn
  dydb_table_permissions = ["dynamodb:BatchWriteItem"]
  function_url_public    = true
}

module "lambda_post_result" {
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-post-result"
  REST_method         = "POST"
  function_name       = "${var.APP_NAME}-post-result"
  environment_variables = {
    DYDB_TABLE_NAME = aws_dynamodb_table.results.id,
    REGION          = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.results.arn
  dydb_table_permissions = ["dynamodb:BatchWriteItem"]
  function_url_public    = true
}

module "lambda_post_image" {
  # source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda?ref=dev"
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-post-image"
  REST_method         = "POST"
  # ^ not actually used in module.aws_lambda_function_url.self because of use_wildcard_method_in_function_url below
  function_name = "${var.APP_NAME}-post-image"
  environment_variables = {
    S3_BUCKET_NAME = aws_s3_bucket.images.id,
    REGION         = var.REGION
  }
  is_s3                               = true
  is_dydb                             = false
  s3_bucket_arn                       = aws_s3_bucket.images.arn
  s3_bucket_permissions               = ["s3:PutObject"]
  function_url_public                 = true
  use_wildcard_method_in_function_url = true
  # ^ required for lambda functions that upload images to S3
}
# rm -rf .terraform/modules
# run ^ after pushing up changes to modules

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
  runtime          = "nodejs20.x"                          # Adjust the runtime as necessary
  role             = aws_iam_role.lambda_drivers_update.arn
  filename         = "${var.APP_NAME}-drivers-update.zip" # The zipped Lambda code
  source_code_hash = data.archive_file.drivers_update.output_base64sha256
  environment {
    variables = {
      LAMBDA_GET_DRIVERS_FUNCTION_URL      = module.lambda_get_drivers.function_url
      LAMBDA_GET_CONSTRUCTORS_FUNCTION_URL = module.lambda_get_constructors.function_url
      # TEST_DYDB_TABLE_NAME                 = aws_dynamodb_table.standings_compute_test.id
      REGION = var.REGION
      # DRIVERS_DYDB_TABLE_NAME              = aws_dynamodb_table.drivers.id
      # CONSTRUCTORS_DYDB_TABLE_NAME         = aws_dynamodb_table.constructors.id
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
