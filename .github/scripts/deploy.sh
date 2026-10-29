
#!/bin/bash
set -euo pipefail

INSTANCE_ID="i-0ff57faaa63fae65b"
REGION="ap-south-1"

COMMAND_ID=$(aws ssm send-command \
  --region "$REGION" \
  --instance-ids "$INSTANCE_ID" \
  --document-name AWS-RunShellScript \
  --parameters '{"commands":["sudo -u ubuntu /home/ubuntu/deploy.sh"]}' \
  --query 'Command.CommandId' \
  --output text)

aws ssm wait command-executed \
  --region "$REGION" \
  --command-id "$COMMAND_ID" \
  --instance-id "$INSTANCE_ID"

aws ssm get-command-invocation \
  --region "$REGION" \
  --command-id "$COMMAND_ID" \
  --instance-id "$INSTANCE_ID" \
  --query 'StandardOutputContent' \
  --output text
