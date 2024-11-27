# module "lambda_get_insights" {
#   # source                 = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2?ref=dev"
#   source                 = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2"
#   APIG_SECURITY_GROUP_ID = aws_security_group.api_gateway_sg.id
#   DYDB_PERMISSIONS       = ["dynamodb:Scan", "dynamodb:DescribeTable"]
#   DYDB_TABLE_ARN         = aws_dynamodb_table.insights.arn
#   ENV_VARS = {
#     DYDB_TABLE_NAME = aws_dynamodb_table.insights.id,
#     REGION          = var.REGION
#     LIMIT           = 60
#   }
#   HANDLER_FILE_PREFIX                 = "app-get-insights"
#   HTTP_METHOD                         = "GET"
#   MEMORY_SIZE                         = 1028
#   NAME                                = "${var.APP_NAME}-get-insights"
#   PRIVATE_APIG_REST_API_EXECUTION_ARN = aws_api_gateway_rest_api.private_api.execution_arn
#   PRIVATE_APIG_REST_API_ID            = aws_api_gateway_rest_api.private_api.id
#   PRIVATE_APIG_REST_API_RESOURCE_ID   = aws_api_gateway_resource.insights.id
#   PRIVATE_SUBNET_IDS                  = aws_subnet.private[*].id
#   SOURCE_DIR                          = "lambda"
#   VPC_ENDPOINT_DYDB_PREFIX_LIST_ID    = aws_vpc_endpoint.dynamodb.prefix_list_id
#   VPC_ID                              = var.BLOG_TLDRLW_VPC_ID
# }
