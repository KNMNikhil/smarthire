# Database Migrations

## Run Chat Table Migration

To create the Chat table in your database, run:

```bash
cd server
node migrations/create-chat-table.js
```

This will create the `Chats` table with the following columns:
- id (Primary Key)
- senderId
- senderName
- senderRole (admin/student)
- recipientId (nullable - for direct messages)
- text
- status (sent/delivered/read)
- createdAt
- updatedAt
