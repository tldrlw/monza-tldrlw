resource "aws_dynamodb_table" "insights" {
  name         = "${var.APP_NAME}-insights"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK" # Partition key (unique identifier for the message)
  # Define table attributes
  attribute {
    name = "PK"
    type = "S"
  }
  tags = {
    Name = "${var.APP_NAME}-insights"
  }
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/dynamodb_table
# best `billing_mode` for dydb: https://www.reddit.com/r/aws/comments/pdsqy5/dynamodb_pricing_model_question_free_tier/
