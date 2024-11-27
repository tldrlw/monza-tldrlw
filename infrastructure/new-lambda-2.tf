module "lambda_get_insights" {
  # source = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2?ref=dev"
  source           = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2"
  DYDB_PERMISSIONS = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  DYDB_TABLE_ARN   = aws_dynamodb_table.insights.arn
  ENV_VARS = {
    DYDB_TABLE_NAME = aws_dynamodb_table.insights.id,
    REGION          = var.REGION
    LIMIT           = 60
  }
  HANDLER_FILE_PREFIX              = "app-get-insights"
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
# must modify locals and aws_api_gateway_deployment depends_on when adding new apig-lambda-2 instantiations

# Collect methods and integrations
locals {
  methods_and_integrations = flatten([
    for lambda_module in [
      module.lambda_get_insights,
      # Add more Lambda module instantiations here, e.g.,...
      # module.lambda_process_data,
      ] : {
      method_id = lambda_module.private_apig_method_id
      uri       = lambda_module.private_apig_integration_uri
    }
  ])
}

module "lambda_stack" {
  # source                        = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2-stack?ref=dev"
  source                        = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2-stack"
  PRIVATE_APIG_RESOURCES        = ["insights"]
  PRIVATE_APIG_STAGE_NAME       = var.PRIVATE_APIG_STAGE_NAME
  APP_NAME                      = var.APP_NAME
  ECS_SERVICE_SECURITY_GROUP_ID = module.ecs_service.ecs_security_group_id
  PUBLIC_SUBNET_IDS             = data.aws_subnets.blog_tldrlw.ids
  REGION                        = "us-east-1"
  VPC_ID                        = var.BLOG_TLDRLW_VPC_ID
}
# rm -rf .terraform/modules

resource "aws_api_gateway_deployment" "private" {
  depends_on = [
    module.lambda_stack.private_apig_policy,
    module.lambda_get_insights.private_apig_method_id,
    module.lambda_get_insights.private_apig_integration_uri
  ]
  rest_api_id = module.lambda_stack.private_apig_id
  triggers = {
    apig_changes   = sha1(jsonencode(module.lambda_stack))
    method_changes = sha1(jsonencode(local.methods_and_integrations))
  }
  lifecycle {
    create_before_destroy = true
  }
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_deployment

variable "PRIVATE_APIG_STAGE_NAME" {
  type    = string
  default = "prod"
}

resource "aws_api_gateway_stage" "main" {
  rest_api_id   = module.lambda_stack.private_apig_id
  stage_name    = var.PRIVATE_APIG_STAGE_NAME
  deployment_id = aws_api_gateway_deployment.private.id
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_stage
