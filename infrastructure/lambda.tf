module "lambda_get_insights" {
  # source = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2?ref=dev"
  source           = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2"
  DYDB_PERMISSIONS = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  DYDB_TABLE_ARN   = aws_dynamodb_table.insights.arn
  ENV_VARS = {
    DYDB_TABLE_NAME = aws_dynamodb_table.insights.id,
    REGION          = var.REGION
  }
  HANDLER_FILE_PREFIX              = "app-get"
  HTTP_METHOD                      = "GET"
  MEMORY_SIZE                      = 1028
  NAME                             = "${var.APP_NAME}-get-insights"
  PRIVATE_APIG_EXECUTION_ARN       = module.lambda_stack.private_apig_execution_arn
  PRIVATE_APIG_ID                  = module.lambda_stack.private_apig_id
  PRIVATE_APIG_RESOURCE_ID         = module.lambda_stack.private_apig_resource_ids["insights"]
  PRIVATE_APIG_SECURITY_GROUP_ID   = module.lambda_stack.private_apig_security_group_id
  PRIVATE_SUBNET_IDS               = module.lambda_stack.private_subnet_ids
  SOURCE_DIR                       = "lambda"
  VPC_ENDPOINT_DYDB_PREFIX_LIST_ID = module.lambda_stack.vpc_endpoint_dydb_prefix_list_id
  VPC_ID                           = var.BLOG_TLDRLW_VPC_ID
}

module "lambda_get_constructors" {
  source           = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2"
  DYDB_PERMISSIONS = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  DYDB_TABLE_ARN   = aws_dynamodb_table.constructors.arn
  ENV_VARS = {
    DYDB_TABLE_NAME = aws_dynamodb_table.constructors.id,
    REGION          = var.REGION
  }
  HANDLER_FILE_PREFIX              = "app-get"
  HTTP_METHOD                      = "GET"
  MEMORY_SIZE                      = 1028
  NAME                             = "${var.APP_NAME}-get-constructors"
  PRIVATE_APIG_EXECUTION_ARN       = module.lambda_stack.private_apig_execution_arn
  PRIVATE_APIG_ID                  = module.lambda_stack.private_apig_id
  PRIVATE_APIG_RESOURCE_ID         = module.lambda_stack.private_apig_resource_ids["constructors"]
  PRIVATE_APIG_SECURITY_GROUP_ID   = module.lambda_stack.private_apig_security_group_id
  PRIVATE_SUBNET_IDS               = module.lambda_stack.private_subnet_ids
  SOURCE_DIR                       = "lambda"
  VPC_ENDPOINT_DYDB_PREFIX_LIST_ID = module.lambda_stack.vpc_endpoint_dydb_prefix_list_id
  VPC_ID                           = var.BLOG_TLDRLW_VPC_ID
}

module "lambda_get_drivers" {
  source           = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2"
  DYDB_PERMISSIONS = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  DYDB_TABLE_ARN   = aws_dynamodb_table.drivers.arn
  ENV_VARS = {
    DYDB_TABLE_NAME = aws_dynamodb_table.drivers.id,
    REGION          = var.REGION
  }
  HANDLER_FILE_PREFIX              = "app-get"
  HTTP_METHOD                      = "GET"
  MEMORY_SIZE                      = 1028
  NAME                             = "${var.APP_NAME}-get-drivers"
  PRIVATE_APIG_EXECUTION_ARN       = module.lambda_stack.private_apig_execution_arn
  PRIVATE_APIG_ID                  = module.lambda_stack.private_apig_id
  PRIVATE_APIG_RESOURCE_ID         = module.lambda_stack.private_apig_resource_ids["drivers"]
  PRIVATE_APIG_SECURITY_GROUP_ID   = module.lambda_stack.private_apig_security_group_id
  PRIVATE_SUBNET_IDS               = module.lambda_stack.private_subnet_ids
  SOURCE_DIR                       = "lambda"
  VPC_ENDPOINT_DYDB_PREFIX_LIST_ID = module.lambda_stack.vpc_endpoint_dydb_prefix_list_id
  VPC_ID                           = var.BLOG_TLDRLW_VPC_ID
}

module "lambda_get_results" {
  source           = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2"
  DYDB_PERMISSIONS = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  DYDB_TABLE_ARN   = aws_dynamodb_table.results.arn
  ENV_VARS = {
    DYDB_TABLE_NAME = aws_dynamodb_table.results.id,
    REGION          = var.REGION
  }
  HANDLER_FILE_PREFIX              = "app-get"
  HTTP_METHOD                      = "GET"
  MEMORY_SIZE                      = 1028
  NAME                             = "${var.APP_NAME}-get-results"
  PRIVATE_APIG_EXECUTION_ARN       = module.lambda_stack.private_apig_execution_arn
  PRIVATE_APIG_ID                  = module.lambda_stack.private_apig_id
  PRIVATE_APIG_RESOURCE_ID         = module.lambda_stack.private_apig_resource_ids["results"]
  PRIVATE_APIG_SECURITY_GROUP_ID   = module.lambda_stack.private_apig_security_group_id
  PRIVATE_SUBNET_IDS               = module.lambda_stack.private_subnet_ids
  SOURCE_DIR                       = "lambda"
  VPC_ENDPOINT_DYDB_PREFIX_LIST_ID = module.lambda_stack.vpc_endpoint_dydb_prefix_list_id
  VPC_ID                           = var.BLOG_TLDRLW_VPC_ID
}
# must modify locals and aws_api_gateway_deployment depends_on when adding new apig-lambda-2 instantiations, and also (maybe) PRIVATE_APIG_RESOURCES in lambda_stack module
