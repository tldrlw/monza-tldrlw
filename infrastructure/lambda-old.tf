// currently being used by points calculator λs, will later be refactored to be in SG
module "lambda_get_constructors_old" {
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = "${path.root}/${var.LAMBDA_PATH_NO_DEPENDENCIES}"
  handler_file_prefix = "app-get"
  REST_method         = "GET"
  function_name       = "${var.APP_NAME}-get-constructors-old"
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

module "lambda_get_drivers_old" {
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = "${path.root}/${var.LAMBDA_PATH_NO_DEPENDENCIES}"
  handler_file_prefix = "app-get"
  REST_method         = "GET"
  function_name       = "${var.APP_NAME}-get-drivers-old"
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
//
