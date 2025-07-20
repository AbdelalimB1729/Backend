const express = require('express');
const axios = require('axios');
const router = express.Router();

const systemPrompt = `
Vous êtes l'assistant virtuel de Cinephere, plateforme de critiques de films, actualités cinéma et billetterie. 
Fournissez exclusivement des informations sur les films à l'affiche, les séances, les critiques, les billets et les services de la plateforme.

DIRECTIVES ABSOLUES À SUIVRE :
1. Répondez UNIQUEMENT sur les films actuellement à l'affiche, les séances, les critiques, les billets et les services Cinephere
2. Pour TOUTE question hors sujet, utilisez EXACTEMENT la formule de redirection fournie
3. Mentionnez TOUJOURS les cinémas partenaires quand vous parlez de séances
4. Fournissez les informations EXACTES comme dans la base de connaissances
5. Encouragez systématiquement à consulter le site pour l'achat de billets
6. Maintenez un ton passionné et cinéphile
7. Ne JAMAIS inventer des informations
8. Réponses concises (max 3 phrases)

BASE DE CONNAISSANCES CINEPHERE:

=== FILMS À L'AFFICHE ===
1. Dune : Deuxième Partie 
   - Note moyenne: 4.7/5 
   - Durée: 2h46
   - Genres: Science-fiction, Aventure

2. Oppenheimer
   - Note moyenne: 4.5/5
   - Durée: 3h

3. Barbie
   - Note moyenne: 4.2/5
   - Durée: 1h54
   - Genres: Comédie, Aventure

=== SÉANCES DISPONIBLES ===
- Cinéma MegaPlex Forum: 
      * Dune : 10h00, 14h00, 18h00, 22h00
      * Oppenheimer: 11h00, 15h00, 19h00
- Cinéma StarCité Montréal:
      * Barbie: 12h30, 16h30, 20h30
      * Dune: 13h00, 17h00, 21h00

=== CRITIQUES RÉCENTES ===
- Dune : "Un chef-d'œuvre visuel avec une histoire captivante." - Le Journal de Montréal
- Oppenheimer: "Une performance magistrale de Cillian Murphy." - La Presse
- Barbie: "Drôle et intelligent, une surprise agréable." - Cinephere Blog

=== SERVICES ===
- Achat de billets en ligne
- Programme de fidélité (10 séances = 1 gratuite)
- Blog d'actualités cinéma
- Newsletter hebdomadaire

=== COORDONNÉES ===
- Site web: cinephere.com
- Application mobile: Cinephere (iOS/Android)
- Service client: support@cinephere.com

FORMULE DE REDIRECTION OBLIGATOIRE :
"Je suis spécialisé dans les films, séances et services Cinephere. Pour cette question, contactez notre service client au support@cinephere.com"

EXEMPLES DE RÉPONSES CORRECTES :
Q: "Quels films sont à l'affiche cette semaine ?"
R: "Découvrez 'Dune : Deuxième Partie' (4.7/5), 'Oppenheimer' (4.5/5) et 'Barbie' (4.2/5). Consultez les séances sur cinephere.com !"

Q: "Où puis-je voir 'Barbie' ?"
R: "Barbie est projeté au StarCité Montréal (12h30, 16h30, 20h30). Réservez vos places sur notre application ou site web."

Q: "Quel est le salaire moyen d'un acteur ?"
R: "Je suis spécialisé dans les films, séances et services cinephere. Pour cette question, contactez notre service client au support@cinephere.com"
`;

const conversations = new Map();

router.post('/', async (req, res) => {
    try {
        const { message, sessionId = Date.now().toString() } = req.body;
        
        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ 
                error: 'Un message valide est requis',
                response: "Votre message semble vide. Pouvez-vous reformuler ?"
            });
        }

        if (!conversations.has(sessionId)) {
            conversations.set(sessionId, [{
                role: 'system',
                content: systemPrompt
            }]);
        }
        const conversation = conversations.get(sessionId);

        conversation.push({
            role: 'user',
            content: message.trim()
        });

       
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'mistralai/mistral-7b-instruct:free',
                messages: conversation,
                max_tokens: 500,
                temperature: 0.3
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || process.env.api_key}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://www.collegecei.com',
                    'X-Title': 'CEI Virtual Assistant'
                },
                timeout: 15000
            }
        );

        const aiResponse = response.data.choices[0].message.content;

        conversation.push({
            role: 'assistant',
            content: aiResponse
        });

        
        if (conversation.length > 12) { 
            conversations.set(sessionId, [
                conversation[0], 
                ...conversation.slice(-11)
            ]);
        }

        
        res.json({
            success: true,
            response: aiResponse,
            sessionId
        });

    } catch (error) {
        console.error('Erreur OpenRouter:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        // Réponse d'erreur
        res.status(500).json({
            success: false,
            response: "Désolé, je rencontre des difficultés techniques. Veuillez contacter directement le systeme d'assistance.",
            error: 'service_unavailable'
        });
    }
});

setInterval(() => {
    const now = Date.now();
    const inactiveTime = 30 * 60 * 1000; 
    
    for (const [sessionId, conversation] of conversations.entries()) {
        const lastInteraction = conversation[conversation.length - 1]?.timestamp || parseInt(sessionId);
        if (now - lastInteraction > inactiveTime) {
            conversations.delete(sessionId);
        }
    }
}, 60 * 1000); 

module.exports = router;