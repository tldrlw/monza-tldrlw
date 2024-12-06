# these λ functions are only for local development, they are publically exposed using function urls
# will get destroyed when run in Github workflow, since .github/workflows/infrastructure.yaml will set ENV to "prd"
# update endpoints in front-end/.env.local

module "lambda_get_insights_dev" {
  count               = var.ENV == "dev" ? 1 : 0
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-get"
  REST_method         = "GET"
  function_name       = "${var.APP_NAME}-get-insights-${var.ENV}"
  environment_variables = {
    DYDB_TABLE_NAME = aws_dynamodb_table.insights.id,
    REGION          = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.insights.arn
  dydb_table_permissions = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  function_url_public    = true
}

module "lambda_get_results_dev" {
  count               = var.ENV == "dev" ? 1 : 0
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-get"
  REST_method         = "GET"
  function_name       = "${var.APP_NAME}-get-results-${var.ENV}"
  environment_variables = {
    DYDB_TABLE_NAME = aws_dynamodb_table.results.id,
    REGION          = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.results.arn
  dydb_table_permissions = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  function_url_public    = true
}

module "lambda_get_constructors_dev" {
  count               = var.ENV == "dev" ? 1 : 0
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-get"
  REST_method         = "GET"
  function_name       = "${var.APP_NAME}-get-constructors-${var.ENV}"
  environment_variables = {
    DYDB_TABLE_NAME = aws_dynamodb_table.constructors.id,
    REGION          = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.constructors.arn
  dydb_table_permissions = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  function_url_public    = true
}

module "lambda_get_drivers_dev" {
  count               = var.ENV == "dev" ? 1 : 0
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-get"
  REST_method         = "GET"
  function_name       = "${var.APP_NAME}-get-drivers-${var.ENV}"
  environment_variables = {
    DYDB_TABLE_NAME = aws_dynamodb_table.drivers.id,
    REGION          = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.drivers.arn
  dydb_table_permissions = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  function_url_public    = true
}

module "lambda_post_insight_dev" {
  count               = var.ENV == "dev" ? 1 : 0
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-post-insight"
  REST_method         = "POST"
  function_name       = "${var.APP_NAME}-post-insight-${var.ENV}"
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

module "lambda_post_result_dev" {
  count               = var.ENV == "dev" ? 1 : 0
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-post-result"
  REST_method         = "POST"
  function_name       = "${var.APP_NAME}-post-result-${var.ENV}"
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

# outputs are named the way they're set in front-end/.env.local, so just copy paste after running tf apply locally

output "LAMBDA_GET_INSIGHTS" {
  value = var.ENV == "dev" && length(module.lambda_get_insights_dev) > 0 ? module.lambda_get_insights_dev[0].function_url : null
}

output "LAMBDA_GET_RESULTS" {
  value = var.ENV == "dev" && length(module.lambda_get_results_dev) > 0 ? module.lambda_get_results_dev[0].function_url : null
}

output "LAMBDA_GET_CONSTRUCTORS" {
  value = var.ENV == "dev" && length(module.lambda_get_constructors_dev) > 0 ? module.lambda_get_constructors_dev[0].function_url : null
}

output "LAMBDA_GET_DRIVERS" {
  value = var.ENV == "dev" && length(module.lambda_get_drivers_dev) > 0 ? module.lambda_get_drivers_dev[0].function_url : null
}

output "LAMBDA_POST_INSIGHT" {
  value = var.ENV == "dev" && length(module.lambda_post_insight_dev) > 0 ? module.lambda_post_insight_dev[0].function_url : null
}

output "LAMBDA_POST_RESULT" {
  value = var.ENV == "dev" && length(module.lambda_post_result_dev) > 0 ? module.lambda_post_result_dev[0].function_url : null
}
