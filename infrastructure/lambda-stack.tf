# Collect methods and integrations
locals {
  methods_and_integrations = flatten([
    for lambda_module in [
      module.lambda_get_insights,
      module.lambda_get_constructors,
      module.lambda_get_drivers,
      module.lambda_get_results,
      module.lambda_post_insight,
      module.lambda_post_result,
      # Add more Lambda module instantiations here, e.g.,...
      ] : {
      method_id = lambda_module.private_apig_method_id
      uri       = lambda_module.private_apig_integration_uri
    }
  ])
}

module "lambda_stack" {
  source = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2-stack?ref=dev"
  # source                        = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2-stack"
  PRIVATE_APIG_RESOURCES        = ["insights", "constructors", "drivers", "results"]
  PRIVATE_APIG_STAGE_NAME       = var.PRIVATE_APIG_STAGE_NAME
  APP_NAME                      = var.APP_NAME
  ECS_SERVICE_SECURITY_GROUP_ID = module.ecs_service.ecs_security_group_id
  PUBLIC_SUBNET_IDS             = data.aws_subnets.blog_tldrlw.ids
  REGION                        = var.REGION
  VPC_ID                        = var.BLOG_TLDRLW_VPC_ID
  VPN_CIDR                      = var.VPN_CIDR
}
# rm -rf .terraform/modules

resource "aws_api_gateway_deployment" "private" {
  depends_on = [
    module.lambda_stack.private_apig_policy,
    module.lambda_get_insights.private_apig_method_id,
    module.lambda_get_insights.private_apig_integration_uri,
    module.lambda_get_constructors.private_apig_method_id,
    module.lambda_get_constructors.private_apig_integration_uri,
    module.lambda_get_drivers.private_apig_method_id,
    module.lambda_get_drivers.private_apig_integration_uri,
    module.lambda_get_results.private_apig_method_id,
    module.lambda_get_results.private_apig_integration_uri,
    module.lambda_post_insight.private_apig_method_id,
    module.lambda_post_insight.private_apig_integration_uri,
    module.lambda_post_result.private_apig_method_id,
    module.lambda_post_result.private_apig_integration_uri,
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

resource "aws_api_gateway_stage" "main" {
  rest_api_id   = module.lambda_stack.private_apig_id
  stage_name    = var.PRIVATE_APIG_STAGE_NAME
  deployment_id = aws_api_gateway_deployment.private.id
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_stage
