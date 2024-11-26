resource "aws_api_gateway_rest_api" "private_api" {
  name              = "${var.APP_NAME}-private-api"
  put_rest_api_mode = "merge"
  endpoint_configuration {
    types            = ["PRIVATE"]
    vpc_endpoint_ids = [aws_vpc_endpoint.api_gateway.id]
  }
}

# If set to PRIVATE recommend to set put_rest_api_mode = merge to not cause the endpoints and associated Route53 records to be deleted.
# ^ https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/api_gateway_rest_api#endpoint_configuration
# A private API endpoint is an API endpoint that can only be accessed from your Amazon Virtual Private Cloud (VPC) using an interface VPC endpoint, which is an endpoint network interface (ENI) that you create in your VPC.
# ^ https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-api-endpoint-types.html
# Private REST APIs in API Gateway: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-apis.html
# Create a private API: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-private-api-create.html

resource "aws_api_gateway_resource" "insights" {
  rest_api_id = aws_api_gateway_rest_api.private_api.id
  parent_id   = aws_api_gateway_rest_api.private_api.root_resource_id
  path_part   = "insights"
}

output "aws_api_gateway_resource_insights_path" {
  value = aws_api_gateway_resource.insights.path
}

resource "aws_api_gateway_method" "method" {
  rest_api_id   = aws_api_gateway_rest_api.private_api.id
  resource_id   = aws_api_gateway_resource.insights.id
  http_method   = "GET"
  authorization = "NONE"
}

# The security group ensures that only authorized resources, such as your ECS service tasks, can access the private API Gateway endpoint.
# By default, without proper security group rules, the endpoint could potentially accept traffic from any resource in the VPC. Assigning a security group allows you to restrict this to only the ECS service or other approved resources.
# Using a dedicated security group for the API Gateway VPC endpoint makes it easier to manage and audit access policies for this specific resource.
resource "aws_security_group" "api_gateway_sg" {
  name        = "api-gateway-sg"
  description = "Security group for API Gateway VPC endpoint"
  vpc_id      = var.BLOG_TLDRLW_VPC_ID
  ingress {
    description     = "Allow traffic from ECS service"
    from_port       = 443
    to_port         = 443
    protocol        = "tcp"
    security_groups = [module.ecs_service.ecs_security_group_id] # Reference ECS service SG
  }
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_vpc_endpoint" "api_gateway" {
  vpc_id              = var.BLOG_TLDRLW_VPC_ID
  service_name        = "com.amazonaws.${var.REGION}.execute-api"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = data.aws_subnets.blog_tldrlw.ids
  security_group_ids  = [aws_security_group.api_gateway_sg.id]
  private_dns_enabled = true
  # ^ requests to the standard API Gateway domain name (e.g., https://<api-id>.execute-api.us-east-1.amazonaws.com) resolve to the private IP addresses of the VPC endpoint. This allows private, secure communication within the VPC without routing through the public internet.
}

resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.private_api.id
  resource_id             = aws_api_gateway_resource.insights.id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.my_lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [aws_api_gateway_rest_api_policy.private_api_policy]
  # ^ infrastructure/api-gateway-iam.tf
  rest_api_id = aws_api_gateway_rest_api.private_api.id
  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.private_api))
  }
  lifecycle {
    create_before_destroy = true
  }
}
# https://registry.terraform.io/providers/hashicorp/aws/5.77.0/docs/resources/api_gateway_deployment

resource "aws_api_gateway_stage" "api_stage" {
  rest_api_id   = aws_api_gateway_rest_api.private_api.id
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  stage_name    = var.ENV
  description   = "Development stage for the private API Gateway"
  variables = {
    lambdaAlias = "dev" # Example of stage-specific variables
  }
}
# https://registry.terraform.io/providers/hashicorp/aws/5.77.0/docs/resources/api_gateway_stage

output "aws_api_gateway_stage_id" {
  value = aws_api_gateway_stage.api_stage.id
}
# ^ not the same as stage name, in this case it's "ags-6ap8m5zb2j-dvm", has the stage name only at the end
