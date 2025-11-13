# Frontend Integration Guide for Prompt Engine

This guide explains how to integrate your existing React frontend with the new FastAPI backend.

## 🔄 Migration from Frontend-Only to Backend Integration

### Changes to Existing Code

#### 1. Update Environment Configuration

Update your `.env.local` file:

```env
# Add backend URL
VITE_API_URL=http://localhost:8000

# Keep existing Gemini API key (for development only)
GEMINI_API_KEY=your_gemini_api_key_here
```

#### 2. Replace Gemini Service

Replace your existing `services/geminiService.ts` with a new backend integration service:

```typescript
// services/apiService.ts
import { StructuredPromptContent } from '../types';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  }

  async generateOptimizedPrompt(idea: string, files: File[]): Promise<{
    structuredPrompt: StructuredPromptContent,
    fullPromptText: string
  }> {
    const formData = new FormData();
    formData.append('idea', idea);
    
    // Add files if any
    if (files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }

    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return {
      structuredPrompt: result.generated_prompt,
      fullPromptText: result.generated_prompt_text
    };
  }

  async testPrompt(prompt: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.test_result;
  }

  async getPrompts(search?: string, rating?: number): Promise<Prompt[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (rating !== undefined) params.append('rating', rating.toString());

    const response = await fetch(`${this.baseUrl}/api/prompts?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async ratePrompt(promptId: string, rating: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/prompts/${promptId}/rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rating }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async deletePrompt(promptId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/prompts/${promptId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  async uploadFile(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getStats(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/stats`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

export const apiService = new ApiService();
```

#### 3. Update App.tsx

Replace the localStorage-based history management with backend calls:

```typescript
// App.tsx - Key changes
import { apiService } from './services/apiService';
import { Prompt, Rating } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  // Replace localStorage with backend calls
  const [history, setHistory] = React.useState<Prompt[]>([]);
  const [currentPrompt, setCurrentPrompt] = React.useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [testResult, setTestResult] = React.useState<string | null>(null);
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<Rating | 'All'>('All');

  // Load history on component mount
  React.useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      const prompts = await apiService.getPrompts();
      setHistory(prompts);
    } catch (err) {
      setError('Failed to load prompts');
      console.error('Error loading prompts:', err);
    }
  };

  const handleSubmit = async (idea: string, files: File[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiService.generateOptimizedPrompt(idea, files);
      
      const newPrompt: Prompt = {
        id: Date.now().toString(), // Backend will assign real ID
        originalIdea: idea,
        generatedPrompt: result.structuredPrompt,
        generatedPromptText: result.fullPromptText,
        rating: Rating.None,
        createdAt: new Date().toISOString(),
        contextFiles: files.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size
        }))
      };

      setCurrentPrompt(newPrompt);
      
      // Reload history to get the new prompt with real ID
      await loadPrompts();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRate = async (id: string, newRating: Rating) => {
    try {
      await apiService.ratePrompt(id, newRating);
      
      // Update local state
      setHistory(prev => prev.map(prompt => 
        prompt.id === id ? { ...prompt, rating: newRating } : prompt
      ));
      
      if (currentPrompt?.id === id) {
        setCurrentPrompt(prev => prev ? { ...prev, rating: newRating } : null);
      }
      
    } catch (err) {
      setError('Failed to update rating');
      console.error('Error updating rating:', err);
    }
  };

  const handleTest = async (promptText: string) => {
    setIsTesting(true);
    setError(null);

    try {
      const result = await apiService.testPrompt(promptText);
      setTestResult(result);
    } catch (err) {
      setError('Failed to test prompt');
      console.error('Error testing prompt:', err);
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (prompt: Prompt) => {
    // Prompts are now automatically saved when generated
    // This function can be used for additional operations if needed
    await loadPrompts(); // Refresh the history
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deletePrompt(id);
      setHistory(prev => prev.filter(prompt => prompt.id !== id));
      
      if (currentPrompt?.id === id) {
        setCurrentPrompt(null);
      }
      
    } catch (err) {
      setError('Failed to delete prompt');
      console.error('Error deleting prompt:', err);
    }
  };

  // Rest of the component remains the same...
  // Filter prompts based on search and rating
  const filteredPrompts = React.useMemo(() => {
    return history.filter(prompt => {
      const matchesSearch = prompt.originalIdea
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesRating = activeFilter === 'All' || prompt.rating === activeFilter;
      return matchesSearch && matchesRating;
    });
  }, [history, searchTerm, activeFilter]);

  return (
    // JSX remains the same...
  );
}

export default App;
```

#### 4. Update Component Interfaces (Optional)

Update the frontend to work with the new response format:

```typescript
// types.ts - Update to match backend response
export interface Prompt {
  id: string;
  original_idea: string; // Match backend snake_case
  generated_prompt: StructuredPromptContent;
  generated_prompt_text: string;
  rating: Rating;
  created_at: string; // Match backend format
  context_files?: ContextFile[];
}

// Add helper functions for data transformation
export const transformBackendPrompt = (backendPrompt: any): Prompt => ({
  id: backendPrompt.id,
  originalIdea: backendPrompt.original_idea,
  generatedPrompt: backendPrompt.generated_prompt,
  generatedPromptText: backendPrompt.generated_prompt_text,
  rating: backendPrompt.rating,
  createdAt: backendPrompt.created_at,
  contextFiles: backendPrompt.context_files
});
```

## 🔧 Development Setup

### Running Both Frontend and Backend

1. **Start Backend** (Terminal 1):
```bash
cd Prompt-Engine/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

2. **Start Frontend** (Terminal 2):
```bash
cd Prompt-Engine
npm install
npm run dev
```

3. **Configure Environment**:
Update `Prompt-Engine/.env.local`:
```env
VITE_API_URL=http://localhost:8000
GEMINI_API_KEY=your_gemini_api_key_here
```

## 🚀 Deployment

### Production Environment Variables

Update `Prompt-Engine/.env.production`:
```env
VITE_API_URL=https://your-backend-domain.com
# Remove GEMINI_API_KEY for production (handled by backend)
```

### Docker Deployment

Update your existing docker-compose or create new deployment configuration:

```yaml
# docker-compose.full.yml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: prompt_engine_root
      MYSQL_DATABASE: prompt_engine
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 20s
      retries: 10

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=mysql+pymysql://user:password@mysql:3306/prompt_engine
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      mysql:
        condition: service_healthy
    volumes:
      - ./backend/uploads:/app/uploads
    restart: unless-stopped

  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  mysql_data:
```

## 🔍 Testing the Integration

### Backend Health Check
```bash
curl http://localhost:8000/api/health
```

### Frontend Integration Test
1. Open http://localhost:5173
2. Generate a prompt
3. Check if it appears in history
4. Test the rating functionality
5. Verify prompt testing works

### API Testing Script
Use the provided `test_api.py` script to verify backend functionality.

## 📊 Migration Benefits

### Why Use Backend?

1. **Data Persistence**: Prompts are saved in database, not lost on browser refresh
2. **Cross-Device Access**: Access prompts from any device
3. **Analytics**: Track usage patterns and performance
4. **File Management**: Better file upload and management
5. **API Scaling**: Handle multiple users and heavy loads
6. **Security**: Centralized API key management
7. **Backup**: Automatic data backup and recovery

### Gradual Migration

You can migrate gradually:

1. **Phase 1**: Keep frontend-only mode, add backend APIs
2. **Phase 2**: Move prompt generation to backend
3. **Phase 3**: Move history to backend
4. **Phase 4**: Add user authentication and multi-user support

## 🛠️ Troubleshooting

### Common Integration Issues

1. **CORS Errors**
   - Verify `ALLOWED_ORIGINS` in backend `.env`
   - Check frontend URL in allowed origins

2. **API Key Issues**
   - Ensure `GEMINI_API_KEY` is set in backend environment
   - Remove frontend API key in production

3. **File Upload Problems**
   - Check backend upload directory permissions
   - Verify file size limits

4. **Database Connection**
   - Verify MySQL is running
   - Check database credentials
   - Ensure database exists

### Development Tips

1. **Enable Backend Debug Logs**:
```python
# In main.py
logging.basicConfig(level=logging.DEBUG)
```

2. **Frontend Network Tab**: Monitor API calls in browser dev tools

3. **Backend Logs**: Watch terminal output for detailed error information

## 📈 Performance Optimization

### Frontend Optimizations

1. **Add Loading States**: Show loading spinners during API calls
2. **Error Boundaries**: Handle API errors gracefully
3. **Caching**: Cache prompts in localStorage as backup
4. **Pagination**: Implement pagination for large history lists

### Backend Optimizations

1. **Database Indexing**: Add indexes for frequently queried fields
2. **Connection Pooling**: Configure database connection pooling
3. **Caching**: Add Redis cache for frequently accessed data
4. **Rate Limiting**: Implement API rate limiting

## 🔐 Security Considerations

### Frontend Security

1. **Environment Variables**: Never expose API keys in frontend
2. **Input Validation**: Validate user inputs before sending to API
3. **HTTPS**: Use HTTPS in production
4. **Content Security Policy**: Implement CSP headers

### Backend Security

1. **Authentication**: Add user authentication (JWT, OAuth)
2. **Authorization**: Implement proper access controls
3. **Rate Limiting**: Prevent API abuse
4. **Input Sanitization**: Validate all API inputs
5. **File Upload Security**: Validate file types and scan uploads

This integration guide provides a complete migration path from your current frontend-only application to a full-stack solution with robust backend services.