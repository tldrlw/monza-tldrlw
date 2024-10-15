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
