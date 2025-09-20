# Re:li API 文件

## 概述

Re:li API 提供記憶釀酒師和時空膠囊功能的後端服務。所有 API 都使用 JSON 格式，並需要適當的認證。

**Base URL**: `http://localhost:3001/api`

## 認證

大部分 API 需要 JWT token 認證。在請求標頭中包含：

```
Authorization: Bearer <your-jwt-token>
```

## 錯誤處理

所有 API 都遵循統一的錯誤回應格式：

```json
{
  "success": false,
  "error": {
    "message": "錯誤描述",
    "code": "ERROR_CODE"
  },
  "timestamp": "2024-01-20T10:30:00Z",
  "path": "/api/endpoint"
}
```

## API 端點

### 認證 (Auth)

#### POST /auth/line-login

LINE 用戶登入

**請求體**:
```json
{
  "lineUserId": "U1234567890abcdef",
  "displayName": "用戶名稱",
  "pictureUrl": "https://profile.line-scdn.net/...",
  "statusMessage": "狀態訊息"
}
```

**回應**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "U1234567890abcdef",
    "displayName": "用戶名稱",
    "pictureUrl": "https://profile.line-scdn.net/...",
    "statusMessage": "狀態訊息"
  }
}
```

#### GET /auth/verify

驗證 JWT token

**標頭**: `Authorization: Bearer <token>`

**回應**:
```json
{
  "success": true,
  "user": {
    "id": "U1234567890abcdef",
    "displayName": "用戶名稱",
    "type": "line_user"
  }
}
```

#### POST /auth/logout

用戶登出

**標頭**: `Authorization: Bearer <token>`

**回應**:
```json
{
  "success": true,
  "message": "登出成功"
}
```

### 回憶 (Memories)

#### GET /memories

獲取用戶的回憶片段

**標頭**: `Authorization: Bearer <token>`

**查詢參數**:
- `emotion` (string, 可選): 情感篩選
- `tag` (string, 可選): 標籤篩選
- `startDate` (string, 可選): 開始日期 (ISO 8601)
- `endDate` (string, 可選): 結束日期 (ISO 8601)
- `limit` (number, 可選): 每頁數量 (預設: 20)
- `offset` (number, 可選): 偏移量 (預設: 0)

**回應**:
```json
{
  "success": true,
  "memories": [
    {
      "id": "memory_1",
      "timestamp": "2024-01-15T10:30:00Z",
      "content": "今天天氣真好，我們一起去公園散步吧！",
      "emotion": "joy",
      "tags": ["戶外", "朋友", "開心"],
      "participants": ["我", "朋友"],
      "confidence": 0.8,
      "intensity": 0.7,
      "processedAt": "2024-01-20T15:30:00Z",
      "source": "chat_export"
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

#### GET /memories/stats

獲取回憶統計資訊

**標頭**: `Authorization: Bearer <token>`

**回應**:
```json
{
  "success": true,
  "stats": {
    "totalMemories": 15,
    "emotionDistribution": {
      "joy": 5,
      "gratitude": 4,
      "love": 3,
      "warmth": 2,
      "excitement": 1
    },
    "topTags": [
      { "tag": "朋友", "count": 8 },
      { "tag": "開心", "count": 5 },
      { "tag": "感謝", "count": 4 }
    ],
    "timeRange": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-01-20T23:59:59Z"
    },
    "averageIntensity": 0.75
  }
}
```

#### GET /memories/search

搜尋回憶片段

**標頭**: `Authorization: Bearer <token>`

**查詢參數**:
- `q` (string, 必填): 搜尋關鍵字
- `emotion` (string, 可選): 情感篩選
- `limit` (number, 可選): 結果數量 (預設: 10)

**回應**:
```json
{
  "success": true,
  "results": [
    {
      "id": "memory_1",
      "timestamp": "2024-01-15T10:30:00Z",
      "content": "今天天氣真好，我們一起去公園散步吧！",
      "emotion": "joy",
      "tags": ["戶外", "朋友"],
      "participants": ["我", "朋友"],
      "confidence": 0.8,
      "intensity": 0.7,
      "processedAt": "2024-01-20T15:30:00Z",
      "source": "chat_export",
      "relevanceScore": 0.9
    }
  ],
  "query": "公園",
  "total": 1
}
```

#### DELETE /memories/:memoryId

刪除回憶片段

**標頭**: `Authorization: Bearer <token>`

**路徑參數**:
- `memoryId` (string): 回憶片段 ID

**回應**:
```json
{
  "success": true,
  "message": "回憶片段已刪除"
}
```

### 膠囊 (Capsules)

#### GET /capsules

獲取用戶的膠囊

**標頭**: `Authorization: Bearer <token>`

**查詢參數**:
- `type` (string, 可選): 膠囊類型 (`sent` | `received`)
- `status` (string, 可選): 膠囊狀態 (`pending` | `unlocked` | `expired`)
- `limit` (number, 可選): 每頁數量 (預設: 20)
- `offset` (number, 可選): 偏移量 (預設: 0)

**回應**:
```json
{
  "success": true,
  "capsules": [
    {
      "id": "capsule_1",
      "type": "sent",
      "memorySnippet": {
        "content": "今天天氣真好，我們一起去公園散步吧！",
        "emotion": "joy",
        "timestamp": "2024-01-15T10:30:00Z",
        "tags": ["戶外", "朋友"]
      },
      "newMessage": "希望未來的我們還能一起享受這樣美好的時光",
      "recipient": {
        "id": "U1234567890abcdef",
        "name": "小明",
        "avatar": "https://profile.line-scdn.net/..."
      },
      "sender": {
        "id": "U0987654321fedcba",
        "name": "我",
        "avatar": "https://profile.line-scdn.net/..."
      },
      "unlockTime": "2024-12-25T00:00:00Z",
      "isUnlocked": false,
      "isPublic": true,
      "createdAt": "2024-01-20T15:30:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "offset": 0,
    "hasMore": false
  }
}
```

#### POST /capsules

創建新的時空膠囊

**標頭**: `Authorization: Bearer <token>`

**請求體**:
```json
{
  "memorySnippet": {
    "id": "memory_1",
    "content": "今天天氣真好，我們一起去公園散步吧！",
    "emotion": "joy",
    "timestamp": "2024-01-15T10:30:00Z",
    "tags": ["戶外", "朋友"]
  },
  "newMessage": "希望未來的我們還能一起享受這樣美好的時光",
  "recipientId": "U1234567890abcdef",
  "unlockTime": "2024-12-25T00:00:00Z",
  "isPublic": true
}
```

**回應**:
```json
{
  "success": true,
  "capsule": {
    "id": "capsule_1",
    "status": "pending",
    "createdAt": "2024-01-20T15:30:00Z"
  }
}
```

#### POST /capsules/:capsuleId/unlock

解鎖時空膠囊

**標頭**: `Authorization: Bearer <token>`

**路徑參數**:
- `capsuleId` (string): 膠囊 ID

**回應**:
```json
{
  "success": true,
  "capsule": {
    "id": "capsule_1",
    "status": "unlocked",
    "unlockedAt": "2024-01-20T16:00:00Z"
  }
}
```

#### DELETE /capsules/:capsuleId

取消時空膠囊

**標頭**: `Authorization: Bearer <token>`

**路徑參數**:
- `capsuleId` (string): 膠囊 ID

**回應**:
```json
{
  "success": true,
  "message": "時空膠囊已取消"
}
```

### 用戶 (Users)

#### GET /users/profile

獲取用戶個人資料

**標頭**: `Authorization: Bearer <token>`

**回應**:
```json
{
  "success": true,
  "user": {
    "id": "U1234567890abcdef",
    "displayName": "用戶名稱",
    "pictureUrl": "https://profile.line-scdn.net/...",
    "statusMessage": "狀態訊息",
    "isActive": true,
    "lastLoginAt": "2024-01-20T10:30:00Z",
    "createdAt": "2024-01-01T00:00:00Z",
    "stats": {
      "totalMemories": 15,
      "totalCapsulesSent": 3,
      "totalCapsulesReceived": 2,
      "totalCapsulesUnlocked": 1
    }
  }
}
```

#### PUT /users/profile

更新用戶個人資料

**標頭**: `Authorization: Bearer <token>`

**請求體**:
```json
{
  "displayName": "新的用戶名稱",
  "statusMessage": "新的狀態訊息"
}
```

**回應**:
```json
{
  "success": true,
  "message": "個人資料已更新",
  "user": {
    "id": "U1234567890abcdef",
    "displayName": "新的用戶名稱",
    "statusMessage": "新的狀態訊息"
  }
}
```

#### GET /users/stats

獲取用戶統計資訊

**標頭**: `Authorization: Bearer <token>`

**回應**:
```json
{
  "success": true,
  "stats": {
    "memories": {
      "total": 15,
      "thisMonth": 5,
      "emotionDistribution": {
        "joy": 5,
        "gratitude": 4,
        "love": 3,
        "warmth": 2,
        "excitement": 1
      }
    },
    "capsules": {
      "sent": {
        "total": 3,
        "unlocked": 1,
        "pending": 2
      },
      "received": {
        "total": 2,
        "unlocked": 1,
        "pending": 1
      }
    },
    "activity": {
      "lastActiveAt": "2024-01-20T10:30:00Z",
      "totalSessions": 25,
      "averageSessionDuration": 15
    }
  }
}
```

#### GET /users/activity

獲取用戶活動記錄

**標頭**: `Authorization: Bearer <token>`

**查詢參數**:
- `type` (string, 可選): 活動類型 (`all` | `capsule_sent` | `capsule_received` | `memory_created`)
- `limit` (number, 可選): 結果數量 (預設: 10)

**回應**:
```json
{
  "success": true,
  "activities": [
    {
      "id": "activity_1",
      "type": "capsule_sent",
      "description": "送出了時空膠囊給小明",
      "timestamp": "2024-01-20T15:30:00Z",
      "data": {
        "recipientName": "小明",
        "unlockTime": "2024-12-25T00:00:00Z"
      }
    }
  ],
  "total": 10
}
```

## 狀態碼

- `200` - 成功
- `201` - 創建成功
- `400` - 請求錯誤
- `401` - 未授權
- `403` - 禁止訪問
- `404` - 資源不存在
- `429` - 請求過於頻繁
- `500` - 伺服器內部錯誤

## 速率限制

API 有速率限制保護：

- 每 15 分鐘最多 100 個請求
- 超過限制會返回 `429` 狀態碼

## 範例

### 使用 curl

```bash
# 登入
curl -X POST http://localhost:3001/api/auth/line-login \
  -H "Content-Type: application/json" \
  -d '{
    "lineUserId": "U1234567890abcdef",
    "displayName": "測試用戶"
  }'

# 獲取回憶
curl -X GET http://localhost:3001/api/memories \
  -H "Authorization: Bearer <your-token>"

# 創建膠囊
curl -X POST http://localhost:3001/api/capsules \
  -H "Authorization: Bearer <your-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "memorySnippet": {...},
    "newMessage": "測試訊息",
    "recipientId": "U1234567890abcdef",
    "unlockTime": "2024-12-25T00:00:00Z"
  }'
```

### 使用 JavaScript

```javascript
// 登入
const loginResponse = await fetch('/api/auth/line-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    lineUserId: 'U1234567890abcdef',
    displayName: '測試用戶'
  })
});

const { token } = await loginResponse.json();

// 獲取回憶
const memoriesResponse = await fetch('/api/memories', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { memories } = await memoriesResponse.json();
```

---

如有任何問題，請查看 [GitHub Issues](https://github.com/your-username/re-li/issues) 或聯繫開發團隊。
