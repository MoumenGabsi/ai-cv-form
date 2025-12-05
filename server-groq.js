const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

const GROQ_API_KEY = process.env.REACT_APP_GROQ_KEY;

app.post('/api/extract-cv', async (req, res) => {
  try {
    const { cvText } = req.body;

    if (!cvText) {
      return res.status(400).json({ error: 'CV text is required' });
    }

    if (!GROQ_API_KEY) {
      return res.status(400).json({ error: 'Groq API key not configured' });
    }

    console.log('Sending CV text to Groq AI for extraction...');
    
    // Call Groq API with extracted text
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are a CV/Resume parser. Extract information from the CV text and return ONLY valid JSON with no additional text or markdown.'
          },
          {
            role: 'user',
            content: `Extract the CV information and return ONLY a JSON object with NO other text. For education and experience, return as arrays of objects:
{
  "name": "full name or empty string",
  "email": "email address or empty string",
  "phone": "phone number or empty string",
  "skills": ["skill1", "skill2", "skill3"],
  "education": [
    {
      "school": "University/Institute name",
      "degree": "Degree level or field (e.g., Bachelor in Computer Science)",
      "from": "start year (e.g., 2015)",
      "to": "end year (e.g., 2019) or 'Present' if still studying",
      "location": "city/country or empty string"
    }
  ],
  "experience": [
    {
      "company": "Company name",
      "position": "Job title",
      "from": "start year or date (e.g., 2020)",
      "to": "end year or date or 'Present' if current",
      "description": "brief description of responsibilities"
    }
  ]
}

CV TEXT:
${cvText}

Return ONLY the JSON object.`
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      return res.status(response.status).json({ 
        error: 'Groq API error',
        details: errorData.error?.message || 'Unknown error'
      });
    }

    const result = await response.json();
    const text = result.choices[0]?.message?.content || '';
    
    console.log('Groq response received');
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('No JSON found in response:', text.substring(0, 200));
      return res.status(400).json({ 
        error: 'Could not extract JSON from AI response',
        rawResponse: text.substring(0, 200)
      });
    }

    const json = JSON.parse(jsonMatch[0]);
    res.json(json);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message,
      hint: 'Make sure Groq API key is set in .env'
    });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { missionType, name, email, phone, message, amount, recurrence, skills, availability, subject, question, timestamp } = req.body;

    if (!name || !email || !missionType) {
      return res.status(400).json({ error: 'Données requises manquantes' });
    }

    // Log the submission (in production, save to database or send email)
    console.log('📬 Nouvelle soumission du Nexus:');
    console.log(`Mission: ${missionType}`);
    console.log(`Nom: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Timestamp: ${timestamp}`);
    
    if (missionType === 'donation') {
      console.log(`Montant: €${amount} (${recurrence})`);
      console.log(`Message: ${message}`);
    } else if (missionType === 'volunteer') {
      console.log(`Compétences: ${skills}`);
      console.log(`Disponibilité: ${availability}`);
    } else if (missionType === 'info') {
      console.log(`Sujet: ${subject}`);
      console.log(`Question: ${question}`);
    } else if (missionType === 'contact') {
      console.log(`Téléphone: ${phone}`);
      console.log(`Message: ${message}`);
    }
    console.log('---');

    res.json({ 
      success: true,
      message: 'Merci pour votre soumission!',
      missionType,
      timestamp
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message,
      hint: 'Erreur lors du traitement'
    });
  }
});

app.post('/api/volunteer-application', async (req, res) => {
  try {
    const { name, email, phone, skills, education, experience, timestamp } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Nom et Email sont obligatoires' });
    }

    // Log the volunteer application (in production, save to database or send email)
    console.log('🛡️ Nouvelle candidature Bénévole:');
    console.log(`Nom: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Téléphone: ${phone || 'Non fourni'}`);
    console.log(`Compétences: ${Array.isArray(skills) ? skills.join(', ') : skills}`);
    console.log(`Éducation: ${education ? education.length : 0} entrée(s)`);
    console.log(`Expérience: ${experience ? experience.length : 0} entrée(s)`);
    console.log(`Timestamp: ${timestamp}`);
    console.log('---');

    res.json({ 
      success: true,
      message: 'Candidature reçue! Nous vous contacterons bientôt.',
      applicationId: `APP-${Date.now()}`,
      timestamp
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message,
      hint: 'Erreur lors du traitement de la candidature'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    type: 'groq-powered + nexus-contact',
    hasApiKey: !!GROQ_API_KEY
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ CV Extractor server running on http://localhost:${PORT}`);
  console.log(`🚀 Using Groq AI (Free, Fast, Production-Ready)`);
  console.log(`🔑 API Key: ${GROQ_API_KEY ? 'Loaded ✓' : 'Missing ✗'}`);
});
