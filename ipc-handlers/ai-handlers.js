const Anthropic = require('@anthropic-ai/sdk')
const Store = require('electron-store')
const store = new Store()

exports.generateContent = async (event, prompt) => {
    const options = store.get('options')
    try {
        const anthropic = new Anthropic({
            apiKey: options.apiKey
        })
        const message = await anthropic.messages.create({
            max_tokens: 4096,
            temperature: 0,
            messages: [{ 
                role: 'user', 
                content: [{
                    type: 'text',
                    text: prompt
                }] 
            }],
            model: 'claude-3-haiku-20240307',
        });
        return message.content;
    } catch (error) {
        console.error('Error generating content:', error)
        throw error
    }
}
