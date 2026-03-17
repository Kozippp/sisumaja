import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      title, 
      description, 
      content, 
      links, 
      client_quote,
      client_review_title 
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Prepare translation prompts
    const translations: any = {};

    // Translate title
    if (title) {
      const titleCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Translate the following Estonian text to English. Keep it concise and professional. Only return the translation, no explanations.'
          },
          {
            role: 'user',
            content: title
          }
        ],
        temperature: 0.3,
      });
      translations.title_en = titleCompletion.choices[0]?.message?.content?.trim() || title;
    }

    // Translate description
    if (description) {
      const descriptionCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Translate the following Estonian text to English. Keep it concise and professional. Only return the translation, no explanations.'
          },
          {
            role: 'user',
            content: description
          }
        ],
        temperature: 0.3,
      });
      translations.description_en = descriptionCompletion.choices[0]?.message?.content?.trim() || description;
    }

    // Translate content blocks
    if (content && Array.isArray(content)) {
      translations.content_en = [];
      
      for (const block of content) {
        const translatedBlock = { ...block };

        // Translate block title if exists
        if (block.title) {
          const titleCompletion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are a professional translator. Translate the following Estonian text to English. Keep it concise and professional. Only return the translation, no explanations.'
              },
              {
                role: 'user',
                content: block.title
              }
            ],
            temperature: 0.3,
          });
          translatedBlock.title = titleCompletion.choices[0]?.message?.content?.trim() || block.title;
        }

        // Translate block content if exists
        if (block.content) {
          const contentCompletion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are a professional translator. Translate the following Estonian text to English. Maintain paragraph breaks and formatting. Only return the translation, no explanations.'
              },
              {
                role: 'user',
                content: block.content
              }
            ],
            temperature: 0.3,
          });
          translatedBlock.content = contentCompletion.choices[0]?.message?.content?.trim() || block.content;
        }

        // Keep media URLs and items unchanged
        translations.content_en.push(translatedBlock);
      }
    }

    // Translate links (only labels, keep URLs unchanged)
    if (links && Array.isArray(links)) {
      translations.links_en = [];
      
      for (const link of links) {
        const translatedLink = { ...link };

        if (link.label) {
          const labelCompletion = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              {
                role: 'system',
                content: 'You are a professional translator. Translate the following Estonian button text to English. Keep it short and action-oriented. Only return the translation, no explanations.'
              },
              {
                role: 'user',
                content: link.label
              }
            ],
            temperature: 0.3,
          });
          translatedLink.label = labelCompletion.choices[0]?.message?.content?.trim() || link.label;
        }

        translations.links_en.push(translatedLink);
      }
    }

    // Translate client quote
    if (client_quote) {
      const quoteCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Translate the following Estonian testimonial quote to English. Keep the tone and sentiment natural. Only return the translation, no explanations.'
          },
          {
            role: 'user',
            content: client_quote
          }
        ],
        temperature: 0.3,
      });
      translations.client_quote_en = quoteCompletion.choices[0]?.message?.content?.trim() || client_quote;
    }

    // Translate client review title
    if (client_review_title) {
      const reviewTitleCompletion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator. Translate the following Estonian review title to English. Keep it concise. Only return the translation, no explanations.'
          },
          {
            role: 'user',
            content: client_review_title
          }
        ],
        temperature: 0.3,
      });
      translations.client_review_title_en = reviewTitleCompletion.choices[0]?.message?.content?.trim() || client_review_title;
    }

    return NextResponse.json({
      success: true,
      translations
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { 
        error: 'translation_failed', 
        message: error instanceof Error ? error.message : 'Translation failed'
      },
      { status: 500 }
    );
  }
}
