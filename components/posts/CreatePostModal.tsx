import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Image, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useSocial } from '@/hooks/useSocial';
import { imageApi } from '@/services/imageApi';
import { socialApi } from '@/services/socialApi';
import { useAlert } from '@/template';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ visible, onClose }: CreatePostModalProps) {
  const { addPost, currentUser } = useSocial();
  const { showAlert } = useAlert();
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [selectedGif, setSelectedGif] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [pollDuration, setPollDuration] = useState(24); // hours
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [isGeneratingHashtags, setIsGeneratingHashtags] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const [showAiWriter, setShowAiWriter] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [selectedWritingStyle, setSelectedWritingStyle] = useState('friendly');
  const [selectedContentType, setSelectedContentType] = useState('post');
  const [showFullContent, setShowFullContent] = useState(false);

  const generateAiContent = async (prompt: string, length: 'short' | 'medium' | 'long') => {
    setIsGeneratingAi(true);
    
    // Comprehensive AI content generation based on style, type, and length
    const contentTemplates = {
      // WRITING STYLES
      professional: {
        post: {
          short: `${prompt} represents a significant opportunity for strategic advancement. Our analysis indicates measurable benefits across key performance indicators. Implementation requires structured approach and stakeholder alignment.`,
          medium: `${prompt} presents compelling evidence for organizational transformation. Through comprehensive market research and competitive analysis, we have identified core value propositions that align with current industry trends. Strategic implementation will require cross-functional collaboration and phased deployment to maximize ROI while mitigating operational risks.`,
          long: `${prompt} constitutes a paradigm-shifting initiative that warrants immediate executive attention and resource allocation. Our preliminary assessment reveals substantial market opportunities, supported by quantitative data and competitive intelligence. The proposed framework encompasses multi-phase implementation strategies, risk mitigation protocols, and performance measurement systems. Stakeholder engagement across all organizational levels will be critical for successful adoption and sustainable outcomes. I recommend establishing a dedicated task force to oversee strategic planning and execution phases.`
        },
        quote: {
          short: `"Success in ${prompt} requires disciplined execution and strategic vision." - Industry Leadership Council`,
          medium: `"The most successful organizations understand that ${prompt} is not merely an opportunity, but a strategic imperative that demands systematic approach and unwavering commitment to excellence." - Global Business Institute`,
          long: `"In today's competitive landscape, ${prompt} represents the confluence of strategic thinking, operational excellence, and market intelligence. Organizations that approach this systematically, with clear governance structures and performance metrics, will establish sustainable competitive advantages that drive long-term value creation." - Executive Leadership Forum`
        }
      },
      
      casual: {
        post: {
          short: `So I've been thinking about ${prompt} lately... Anyone else feel like this is pretty cool? Would love to hear your thoughts on this!`,
          medium: `Hey everyone! 👋 Been diving into ${prompt} recently and honestly, it's way more interesting than I expected. There's so much depth here that I never really considered before. Has anyone else explored this? What's been your experience? Drop your thoughts below - curious to see different perspectives!`,
          long: `Okay, so ${prompt} has been on my mind for weeks now, and I finally decided to share some thoughts with you all. It's funny how these things work - you start looking into something casually, and then suddenly you're down this whole rabbit hole of discovery. I've been chatting with friends about it, reading up on different viewpoints, and honestly? There's way more to unpack here than meets the eye. Some of the insights I've stumbled across have genuinely changed how I think about related topics. Anyone else been on a similar journey with this? Would love to swap stories and maybe learn something new from your experiences! 🤔✨`
        },
        quote: {
          short: `"Life's too short not to explore ${prompt}!" 😊`,
          medium: `"You know what? ${prompt} might seem complex at first, but once you dive in, it's actually pretty amazing how everything connects." 🌟`,
          long: `"The best part about ${prompt} is that it's one of those things where the more you learn, the more you realize how much there is to discover. It's like opening a door to a whole new world of possibilities and connections you never saw before." 💫`
        }
      },
      
      friendly: {
        post: {
          short: `Hi friends! 😊 I wanted to share something about ${prompt} that's been really inspiring me lately. Hope it brightens your day too!`,
          medium: `Hello beautiful people! 🌟 I've been reflecting on ${prompt} and wanted to share some positive vibes with you all. There's something really special about how this connects us and brings out the best in our community. I'm grateful to be on this journey with such wonderful people. What are your thoughts? I'd love to hear your experiences! 💕`,
          long: `Hey there, amazing friends! 💖 I hope you're all having a wonderful day. I wanted to take a moment to talk about ${prompt} because it's been filling my heart with so much joy and gratitude lately. There's something truly magical about how topics like this bring us together, create meaningful conversations, and help us grow as individuals and as a community. I'm constantly amazed by the kindness, wisdom, and support you all share. Your perspectives always teach me something new and remind me why I'm so grateful to be connected with such incredible people. Please share your thoughts - I genuinely value each and every one of your voices! Sending you all love and positive energy! 🌈✨`
        },
        quote: {
          short: `"${prompt} reminds us that we're all in this together! 💕"`,
          medium: `"The beautiful thing about ${prompt} is how it brings out the kindness in people and creates genuine connections that make the world a little brighter." 🌟💕`,
          long: `"${prompt} has this wonderful way of reminding us that despite our differences, we all share common hopes, dreams, and experiences. It's in these moments of connection that we find our shared humanity and the strength to support each other on this beautiful journey we call life." 💖🌈`
        }
      },
      
      humorous: {
        post: {
          short: `${prompt}? More like... okay, I don't have a clever joke yet, but trust me, it's funnier in my head! 😂 Anyone got better material?`,
          medium: `So apparently ${prompt} is a thing now, and I'm over here like "Did I miss a memo?" 🤷‍♀️ Seriously though, it's actually pretty interesting once you get past the initial confusion of wondering if you're pronouncing it right. Anyone else feel like they're constantly behind on these trends, or is it just me living under my comfortable rock? 😅`,
          long: `Alright, confession time: I thought ${prompt} was something completely different until about 5 minutes ago. 🙈 And now I'm sitting here pretending I've been an expert all along while frantically googling everything I can find about it. Classic me, right? But hey, at least I'm consistent in my ability to be fashionably late to every trend! 😂 On a serious note though (yes, I can do serious), this is actually pretty fascinating stuff. Who knew learning could be this entertaining? Now if someone could just explain it to me like I'm five, that would be great. Asking for a friend... who is definitely me. 🤓✨`
        },
        quote: {
          short: `"${prompt}: Because life wasn't confusing enough already!" 😄`,
          medium: `"They say ${prompt} is the future, but I'm still trying to figure out the present. One step at a time, right?" 🤔😂`,
          long: `"${prompt} is like trying to solve a puzzle while someone keeps changing the picture on the box. But hey, at least we're all confused together, and that's got to count for something!" 😅🧩`
        }
      },
      
      inspirational: {
        post: {
          short: `✨ ${prompt} reminds us that every challenge is an opportunity to grow. Believe in your journey and trust the process! 🌟`,
          medium: `🌟 There's something powerful about ${prompt} that speaks to the resilience of the human spirit. Every time we face uncertainty, we have a choice: to see obstacles or opportunities. Today, I choose to see the possibility for growth, connection, and positive change. Remember, your journey is unique, and every step forward matters, no matter how small. Keep shining! ✨💫`,
          long: `✨ ${prompt} has become a beautiful reminder of how extraordinary ordinary moments can be when we approach them with intention and hope. Life has a way of presenting us with exactly what we need, even when it doesn't look like what we expected. Every challenge we face is sculpting us into who we're meant to become. Every setback is setting us up for a comeback. Every moment of doubt is an invitation to discover our inner strength. You are more resilient than you know, more capable than you believe, and more deserving of good things than you might feel right now. Trust your journey, embrace your growth, and remember that the world needs exactly what you have to offer. Your story matters, your voice matters, and you matter. Keep moving forward with courage and grace! 🌟💖✨`
        },
        quote: {
          short: `"${prompt} teaches us that growth happens outside our comfort zone." 🌱`,
          medium: `"In every aspect of ${prompt}, we find opportunities to become the person we're meant to be. Embrace the journey with courage and trust." ✨`,
          long: `"${prompt} is not just about the destination, but about who we become along the way. Every step forward, every lesson learned, every moment of courage builds the foundation for the life we're meant to live. Trust the process, embrace the growth, and remember that you are exactly where you need to be." 🌟`
        }
      },
      
      educational: {
        post: {
          short: `📚 Understanding ${prompt}: Key concepts, practical applications, and why it matters in today's context. Let's explore the fundamentals together!`,
          medium: `🎓 Let's dive into ${prompt} and break down the essential components that make this topic so relevant today. Understanding the core principles helps us make informed decisions and engage more meaningfully with related concepts. I'll share some key insights and practical examples that illustrate why this knowledge is valuable for personal and professional development.`,
          long: `📖 Today, let's explore ${prompt} through an educational lens, examining its historical context, current applications, and future implications. This comprehensive overview will cover fundamental principles, real-world case studies, and practical strategies for implementation. By understanding both the theoretical framework and practical applications, we can develop a more nuanced appreciation for how this concept influences various aspects of our lives. I'll provide actionable insights, additional resources for further learning, and discussion questions to help deepen your understanding. Knowledge is most powerful when shared and applied thoughtfully! 🌟📚`
        },
        quote: {
          short: `"The purpose of ${prompt} is to expand our understanding and capabilities." - Educational Research`,
          medium: `"True learning in ${prompt} occurs when we move beyond memorization to meaningful application and critical thinking." - Pedagogical Studies`,
          long: `"${prompt} exemplifies how effective education transforms not just what we know, but how we think, approach problems, and contribute to our communities. The goal is not just knowledge acquisition, but wisdom development and positive impact." - Educational Philosophy Institute`
        }
      },
      
      storytelling: {
        post: {
          short: `Once upon a time, ${prompt} seemed impossible. Today, it's changing everything. Here's the story of how we got here... 📖`,
          medium: `There's a story behind every breakthrough, and ${prompt} has one of the most fascinating journeys I've encountered. It started with a simple question, faced numerous obstacles, and transformed through the persistence of individuals who refused to give up. The twists and turns along the way reveal important lessons about innovation, resilience, and the power of collective effort.`,
          long: `Every great story has moments that change everything, and the tale of ${prompt} is filled with such moments. Picture this: a small group of visionaries facing seemingly insurmountable challenges, armed with nothing but determination and a belief that things could be better. The journey wasn't linear - there were setbacks that felt like endings, breakthroughs that came from unexpected places, and countless moments where success hung by a thread. But here's what makes this story truly remarkable: it's not just about the destination, but about how each chapter revealed new possibilities and brought together diverse voices united by common purpose. The characters in this story - researchers, practitioners, skeptics turned believers, and quiet champions - each played crucial roles in shaping what we see today. And the most exciting part? This story is still being written, with new chapters emerging every day through the contributions of people just like us. What chapter will you write? 📚✨`
        },
        quote: {
          short: `"Every story of ${prompt} begins with someone who dared to imagine differently." 📖`,
          medium: `"The most powerful stories about ${prompt} are not about perfection, but about persistence, learning, and the courage to continue writing when the ending is unknown." ✨`,
          long: `"In the grand narrative of human progress, ${prompt} represents a chapter where ordinary people chose to do extraordinary things, where setbacks became setups for comebacks, and where the impossible became inevitable through the power of collective storytelling and shared vision." 🌟`
        }
      }
    };

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let generatedContent = '';
    
    // Get content based on style and type
    const styleContent = contentTemplates[selectedWritingStyle as keyof typeof contentTemplates];
    if (styleContent && styleContent[selectedContentType as keyof typeof styleContent]) {
      const typeContent = styleContent[selectedContentType as keyof typeof styleContent];
      generatedContent = typeContent[length as keyof typeof typeContent];
    } else {
      // Fallback to friendly style
      const fallbackContent = contentTemplates.friendly[selectedContentType as keyof typeof contentTemplates.friendly];
      generatedContent = fallbackContent[length as keyof typeof fallbackContent] || `Here's some content about ${prompt}! 🌟`;
    }
    
    // Add relevant hashtags based on style and content type
    const relevantHashtags = [];
    
    // Style-based hashtags
    switch (selectedWritingStyle) {
      case 'professional':
        relevantHashtags.push('#business', '#professional', '#strategy');
        break;
      case 'casual':
        relevantHashtags.push('#casual', '#thoughts', '#life');
        break;
      case 'friendly':
        relevantHashtags.push('#community', '#friendship', '#positive');
        break;
      case 'humorous':
        relevantHashtags.push('#funny', '#humor', '#lol');
        break;
      case 'inspirational':
        relevantHashtags.push('#inspiration', '#motivation', '#growth');
        break;
      case 'educational':
        relevantHashtags.push('#education', '#learning', '#knowledge');
        break;
      case 'storytelling':
        relevantHashtags.push('#story', '#narrative', '#journey');
        break;
    }
    
    // Content type hashtags
    if (selectedContentType === 'quote') {
      relevantHashtags.push('#quotes', '#wisdom', '#inspiration');
    } else {
      relevantHashtags.push('#sharing', '#discussion', '#thoughts');
    }
    
    // Topic-based hashtags
    const promptLower = prompt.toLowerCase();
    if (promptLower.includes('tech')) relevantHashtags.push('#technology', '#innovation');
    if (promptLower.includes('business')) relevantHashtags.push('#entrepreneur', '#startup');
    if (promptLower.includes('life')) relevantHashtags.push('#lifestyle', '#personal');
    if (promptLower.includes('success')) relevantHashtags.push('#success', '#achievement');
    
    setHashtags(prev => [...new Set([...prev, ...relevantHashtags])]);
    setIsGeneratingAi(false);
    
    return generatedContent;
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          // Microsoft Office Documents
          'application/msword', // .doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'application/vnd.ms-excel', // .xls
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'application/vnd.ms-powerpoint', // .ppt
          'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
          
          // PDFs and Text
          'application/pdf', // .pdf
          'text/plain', // .txt
          'text/csv', // .csv
          'text/rtf', // .rtf
          'application/rtf', // .rtf
          
          // Images
          'image/jpeg', // .jpg, .jpeg
          'image/png', // .png
          'image/gif', // .gif
          'image/bmp', // .bmp
          'image/webp', // .webp
          'image/tiff', // .tiff
          'image/svg+xml', // .svg
          
          // Videos
          'video/mp4', // .mp4
          'video/avi', // .avi
          'video/quicktime', // .mov
          'video/x-msvideo', // .avi
          'video/webm', // .webm
          'video/x-flv', // .flv
          'video/3gpp', // .3gp
          
          // Audio
          'audio/mpeg', // .mp3
          'audio/wav', // .wav
          'audio/x-wav', // .wav
          'audio/aac', // .aac
          'audio/ogg', // .ogg
          'audio/webm', // .webm
          'audio/flac', // .flac
          'audio/x-ms-wma', // .wma
          
          // Archives and Compression
          'application/zip', // .zip
          'application/x-rar-compressed', // .rar
          'application/x-7z-compressed', // .7z
          'application/gzip', // .gz
          'application/x-tar', // .tar
          
          // Code Files
          'text/html', // .html
          'text/css', // .css
          'application/javascript', // .js
          'application/json', // .json
          'application/xml', // .xml
          'text/xml', // .xml
          'application/x-python-code', // .py
          'text/x-python', // .py
          'application/x-java-source', // .java
          'text/x-c', // .c
          'text/x-c++', // .cpp
          'text/x-csharp', // .cs
          'application/x-php', // .php
          'text/x-ruby', // .rb
          'application/x-sh', // .sh
          
          // Design Files
          'application/postscript', // .eps, .ai
          'image/vnd.adobe.photoshop', // .psd
          'application/x-sketch', // .sketch
          'application/figma', // .fig
          
          // eBooks and Documents
          'application/epub+zip', // .epub
          'application/x-mobipocket-ebook', // .mobi
          'application/vnd.amazon.ebook', // .azw
          
          // Data Files
          'application/vnd.google-earth.kml+xml', // .kml
          'application/gpx+xml', // .gpx
          'application/x-sqlite3', // .sqlite, .db
          
          // CAD and 3D Files
          'application/x-dwg', // .dwg
          'model/obj', // .obj
          'application/x-3ds', // .3ds
          'model/stl', // .stl
          
          // Fonts
          'font/ttf', // .ttf
          'font/otf', // .otf
          'application/x-font-woff', // .woff
          'font/woff2', // .woff2
          
          // Catch-all
          '*/*'
        ],
        multiple: true
      });
      
      if (!result.canceled && result.assets) {
        const validFiles = result.assets.filter(file => {
          const sizeInMB = (file.size || 0) / (1024 * 1024);
          const ext = file.name?.split('.').pop()?.toLowerCase();
          
          // Different size limits for different file types
          let sizeLimit = 100; // Default 100MB
          
          if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '')) {
            sizeLimit = 25; // Images: 25MB
          } else if (['mp4', 'avi', 'mov', 'webm'].includes(ext || '')) {
            sizeLimit = 500; // Videos: 500MB
          } else if (['mp3', 'wav', 'aac', 'ogg', 'flac'].includes(ext || '')) {
            sizeLimit = 50; // Audio: 50MB
          } else if (['pdf', 'doc', 'docx', 'ppt', 'pptx'].includes(ext || '')) {
            sizeLimit = 100; // Documents: 100MB
          } else if (['zip', 'rar', '7z', 'gz', 'tar'].includes(ext || '')) {
            sizeLimit = 200; // Archives: 200MB
          }
          
          return sizeInMB <= sizeLimit;
        });
        
        if (validFiles.length !== result.assets.length) {
          const rejectedFiles = result.assets.length - validFiles.length;
          showAlert(
            'Some Files Rejected',
            `${rejectedFiles} file(s) were skipped due to size limits:\n\u2022 Images: 25MB max\n\u2022 Audio: 50MB max\n\u2022 Documents: 100MB max\n\u2022 Archives: 200MB max\n\u2022 Videos: 500MB max`
          );
        }
        
        setSelectedFiles(prev => [...prev, ...validFiles]);
        
        // Show success message with file details
        const fileTypes = [...new Set(validFiles.map(file => {
          const ext = file.name?.split('.').pop()?.toLowerCase();
          return ext || 'unknown';
        }))];
        
        const supportedCategories = {
          documents: ['pdf', 'doc', 'docx', 'txt', 'rtf'],
          spreadsheets: ['xls', 'xlsx', 'csv'],
          presentations: ['ppt', 'pptx'],
          images: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'],
          videos: ['mp4', 'avi', 'mov', 'webm', 'flv', '3gp'],
          audio: ['mp3', 'wav', 'aac', 'ogg', 'flac', 'wma'],
          archives: ['zip', 'rar', '7z', 'gz', 'tar'],
          code: ['html', 'css', 'js', 'json', 'xml', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'sh'],
          design: ['psd', 'ai', 'eps', 'sketch', 'fig'],
          ebooks: ['epub', 'mobi', 'azw'],
          cad: ['dwg', 'obj', '3ds', 'stl'],
          fonts: ['ttf', 'otf', 'woff', 'woff2'],
          data: ['db', 'sqlite', 'kml', 'gpx']
        };
        
        const categories = Object.entries(supportedCategories)
          .filter(([_, extensions]) => extensions.some(ext => fileTypes.includes(ext)))
          .map(([category]) => category);
        
        showAlert(
          'Files Added Successfully! 🎉',
          `Added ${validFiles.length} file(s)\n\nFile types: ${fileTypes.join(', ')}\nCategories: ${categories.join(', ') || 'General'}\n\nSupported: Documents, Spreadsheets, Images, Videos, Audio, Code, Design files, Archives, eBooks, 3D/CAD, Fonts & more!`
        );
      }
    } catch (error) {
      console.error('Document picker error:', error);
      showAlert('Error', 'Failed to select files. Please try again.');
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles(files => files.filter((_, index) => index !== indexToRemove));
  };

  const getFileCategory = (fileName: string) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    
    const categories = {
      document: { exts: ['pdf', 'doc', 'docx', 'txt', 'rtf'], color: '#3B82F6', icon: 'description' },
      spreadsheet: { exts: ['xls', 'xlsx', 'csv'], color: '#10B981', icon: 'table-chart' },
      presentation: { exts: ['ppt', 'pptx'], color: '#F59E0B', icon: 'slideshow' },
      image: { exts: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'], color: '#8B5CF6', icon: 'image' },
      video: { exts: ['mp4', 'avi', 'mov', 'webm', 'flv', '3gp'], color: '#EF4444', icon: 'video-library' },
      audio: { exts: ['mp3', 'wav', 'aac', 'ogg', 'flac', 'wma'], color: '#06B6D4', icon: 'audio-file' },
      archive: { exts: ['zip', 'rar', '7z', 'gz', 'tar'], color: '#F97316', icon: 'archive' },
      code: { exts: ['html', 'css', 'js', 'json', 'xml', 'py', 'java', 'c', 'cpp', 'cs', 'php', 'rb', 'sh'], color: '#14B8A6', icon: 'code' },
      design: { exts: ['psd', 'ai', 'eps', 'sketch', 'fig'], color: '#EC4899', icon: 'palette' },
      ebook: { exts: ['epub', 'mobi', 'azw'], color: '#84CC16', icon: 'menu-book' },
      cad: { exts: ['dwg', 'obj', '3ds', 'stl'], color: '#A855F7', icon: 'view-in-ar' },
      font: { exts: ['ttf', 'otf', 'woff', 'woff2'], color: '#6366F1', icon: 'font-download' },
      data: { exts: ['db', 'sqlite', 'kml', 'gpx'], color: '#64748B', icon: 'storage' }
    };
    
    for (const [category, info] of Object.entries(categories)) {
      if (info.exts.includes(ext || '')) {
        return { type: category, ...info };
      }
    }
    
    return { type: 'other', exts: [], color: '#9CA3AF', icon: 'attach-file' };
  };

  const pickGif = async () => {
    setShowGifPicker(true);
  };

  const selectGif = (gifUrl: string) => {
    setSelectedGif(gifUrl);
    setShowGifPicker(false);
  };

  const removeGif = () => {
    setSelectedGif(null);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const createPoll = () => {
    const validOptions = pollOptions.filter(option => option.trim());
    if (validOptions.length < 2) {
      showAlert('Invalid Poll', 'Please provide at least 2 poll options.');
      return;
    }
    
    const poll = {
      question: 'What do you think?',
      options: validOptions.map(option => ({ text: option, votes: 0 })),
      duration: pollDuration,
      totalVotes: 0
    };
    
    setShowPollCreator(false);
    showAlert('Poll Created', 'Your poll has been added to the post.');
    return poll;
  };

  const selectLocation = () => {
    // Simulate location selection
    const locations = [
      { name: 'New York, NY', coords: { lat: 40.7128, lng: -74.0060 } },
      { name: 'Los Angeles, CA', coords: { lat: 34.0522, lng: -118.2437 } },
      { name: 'Chicago, IL', coords: { lat: 41.8781, lng: -87.6298 } },
      { name: 'Houston, TX', coords: { lat: 29.7604, lng: -95.3698 } },
      { name: 'Phoenix, AZ', coords: { lat: 33.4484, lng: -112.0740 } }
    ];
    
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    setSelectedLocation(randomLocation);
    setShowLocationPicker(false);
    showAlert('Location Added', `Added location: ${randomLocation.name}`);
  };

  const removeLocation = () => {
    setSelectedLocation(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const generateSmartHashtags = () => {
    if (!content.trim()) {
      showAlert('Add Content', 'Please add some content first to generate hashtags');
      return;
    }

    setIsGeneratingHashtags(true);
    
    // Simple hashtag generation based on content
    const words = content.toLowerCase().match(/\b\w{4,}\b/g) || [];
    const commonWords = ['this', 'that', 'with', 'have', 'will', 'from', 'they', 'know', 'want', 'been', 'good', 'much', 'some', 'time', 'very', 'when', 'come', 'here', 'just', 'like', 'long', 'make', 'many', 'over', 'such', 'take', 'than', 'them', 'well', 'were'];
    
    const relevantWords = words.filter(word => 
      !commonWords.includes(word) && word.length > 3
    ).slice(0, 5);
    
    const popularHashtags = ['#trending', '#viral', '#awesome', '#amazing', '#love', '#instagood', '#photooftheday', '#happy', '#follow', '#picoftheday'];
    
    const generated = [
      ...relevantWords.map(word => `#${word}`),
      ...popularHashtags.slice(0, 3)
    ].slice(0, 6);
    
    const uniqueHashtags = [...new Set([...hashtags, ...generated])];
    setHashtags(uniqueHashtags);
    
    setTimeout(() => {
      setIsGeneratingHashtags(false);
      showAlert('Hashtags Generated', `Added ${generated.length} relevant hashtags`);
    }, 1000);
  };

  const analyzeImage = async (imageUri: string) => {
    setIsAnalyzingImage(true);
    try {
      const analysis = await imageApi.analyzeImageForHashtags(imageUri);
      setAiAnalysis(analysis);
      
      const combinedHashtags = [...hashtags, ...analysis.hashtags];
      const uniqueHashtags = [...new Set(combinedHashtags)].slice(0, 10);
      setHashtags(uniqueHashtags);
      setDetectedObjects(analysis.detectedObjects);
      
      showAlert(
        'AI Image Analysis Complete', 
        `Detected: ${analysis.detectedObjects.join(', ')}\nConfidence: ${Math.round(analysis.confidence * 100)}%\nMood: ${analysis.mood}`
      );
    } catch (error) {
      console.error('Image analysis failed:', error);
      showAlert('Analysis Error', 'Could not analyze image. Generated basic hashtags instead.');
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      showAlert('Permission Required', 'Sorry, we need camera roll permissions to add images!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setSelectedImage(imageUri);
      await analyzeImage(imageUri);
    }
  };

  const removeHashtag = (indexToRemove: number) => {
    setHashtags(hashtags.filter((_, index) => index !== indexToRemove));
  };

  const addCustomHashtag = () => {
    showAlert(
      'Add Hashtag',
      'Enter a custom hashtag (without #):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: () => {
            // For demo purposes, add a sample hashtag
            const sampleHashtags = ['#creative', '#inspiration', '#awesome', '#trending', '#viral', '#new'];
            const randomHashtag = sampleHashtags[Math.floor(Math.random() * sampleHashtags.length)];
            if (!hashtags.includes(randomHashtag)) {
              setHashtags([...hashtags, randomHashtag]);
            }
          }
        }
      ]
    );
  };

  const addTrendingHashtags = () => {
    const trendingHashtags = ['#trending', '#viral', '#popular', '#fyp', '#explore', '#new'];
    const combinedHashtags = [...hashtags, ...trendingHashtags.slice(0, 3)];
    const uniqueHashtags = [...new Set(combinedHashtags)].slice(0, 8);
    setHashtags(uniqueHashtags);
  };

  const createPost = async () => {
    if (!content.trim()) {
      showAlert('Content Required', 'Please add some content to your post');
      return;
    }

    setIsPosting(true);
    try {
      // Create mock user if none exists
      const user = currentUser || {
        id: '1',
        email: 'user@example.com',
        username: 'user',
        displayName: 'Demo User',
        verified: false,
        followers: 0,
        following: 0,
        createdAt: new Date().toISOString()
      };

      const newPost = await socialApi.createPost(content, hashtags);
      
      // Add live stream properties if this is a live post
      if (isLive) {
        newPost.isLive = true;
        newPost.liveViewers = Math.floor(Math.random() * 1000) + 50;
      }

      // Add media if selected
      if (selectedImage) {
        newPost.mediaUrl = selectedImage;
        newPost.mediaType = 'image';
      }

      // Add GIF if selected
      if (selectedGif) {
        newPost.mediaUrl = selectedGif;
        newPost.mediaType = 'gif';
      }

      // Add location if selected
      if (selectedLocation) {
        newPost.location = selectedLocation.name;
        newPost.coordinates = selectedLocation.coords;
      }

      // Add poll if created
      const validPollOptions = pollOptions.filter(option => option.trim());
      if (validPollOptions.length >= 2) {
        newPost.poll = {
          question: 'What do you think?',
          options: validPollOptions.map(option => ({ text: option, votes: 0 })),
          duration: pollDuration,
          totalVotes: 0
        };
      }

      // Add file attachments
      if (selectedFiles.length > 0) {
        newPost.attachments = selectedFiles.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          uri: file.uri
        }));
      }

      // Add AI analysis data if available
      if (aiAnalysis) {
        newPost.aiAnalysis = aiAnalysis;
      }

      // Set the user
      newPost.user = user;
      newPost.userId = user.id;

      // Add to posts
      addPost(newPost);
      
      // Reset form
      setContent('');
      setHashtags([]);
      setSelectedImage(null);
      setSelectedFiles([]);
      setSelectedGif(null);
      setSelectedLocation(null);
      setPollOptions(['', '']);
      setShowPollCreator(false);
      setIsLive(false);
      setAiAnalysis(null);
      setDetectedObjects([]);
      setShowAiWriter(false);
      setAiPrompt('');
      setSelectedWritingStyle('friendly');
      setSelectedContentType('post');
      
      showAlert('Success', 'Post created successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      showAlert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Post</Text>
          <TouchableOpacity 
            onPress={createPost}
            disabled={isPosting || !content.trim()}
            style={[styles.postButton, (!content.trim() || isPosting) && styles.postButtonDisabled]}
          >
            {isPosting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={[styles.postButtonText, (!content.trim() || isPosting) && styles.postButtonTextDisabled]}>
                Post
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentUser?.displayName?.charAt(0) || 'U'}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{currentUser?.displayName || 'User'}</Text>
              <Text style={styles.userHandle}>@{currentUser?.username || 'user'}</Text>
            </View>
          </View>

          {/* Content Input with Show More/Less */}
          <View style={styles.contentInputContainer}>
            <TextInput
              style={[
                styles.contentInput,
                !showFullContent && content.length > 180 && styles.contentInputCollapsed
              ]}
              placeholder="What's happening?"
              placeholderTextColor="#9CA3AF"
              multiline
              value={content}
              onChangeText={setContent}
              maxLength={4000}
              numberOfLines={showFullContent ? undefined : content.length > 180 ? 6 : undefined}
              scrollEnabled={showFullContent}
            />
            
            {content.length > 180 && (
              <TouchableOpacity 
                style={styles.showMoreButton}
                onPress={() => setShowFullContent(!showFullContent)}
              >
                <Text style={styles.showMoreText}>
                  {showFullContent ? 'Show Less' : 'Show More'}
                </Text>
                <MaterialIcons 
                  name={showFullContent ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                  size={16} 
                  color="#3B82F6" 
                />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.characterCountContainer}>
            <Text style={styles.characterCount}>
              {content.length}/4000 characters
            </Text>
            {content.length > 180 && (
              <Text style={styles.previewInfo}>
                Preview: {showFullContent ? 'Full text' : '180 chars'}
              </Text>
            )}
          </View>

          {/* AI Writer Panel */}
          {showAiWriter && (
            <View style={styles.aiWriterPanel}>
              <View style={styles.aiWriterHeader}>
                <Ionicons name="bulb" size={20} color="#3B82F6" />
                <Text style={styles.aiWriterTitle}>AI Writing Assistant</Text>
                <TouchableOpacity onPress={() => setShowAiWriter(false)}>
                  <MaterialIcons name="close" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.aiPromptInput}
                placeholder="What would you like to write about? (e.g., motivational, tech innovation, business tip)"
                placeholderTextColor="#9CA3AF"
                multiline
                value={aiPrompt}
                onChangeText={setAiPrompt}
                maxLength={200}
              />
              
              <View style={styles.aiLengthOptions}>
                <TouchableOpacity 
                  style={[styles.lengthOption, styles.shortLength]}
                  onPress={async () => {
                    if (aiPrompt.trim()) {
                      const aiContent = await generateAiContent(aiPrompt, 'short');
                      setContent(aiContent);
                      setShowAiWriter(false);
                    } else {
                      showAlert('Prompt Required', 'Please enter what you want to write about');
                    }
                  }}
                  disabled={isGeneratingAi}
                >
                  <Ionicons name="flash" size={24} color="white" />
                  <Text style={styles.lengthOptionText}>Short</Text>
                  <Text style={styles.lengthOptionSubtext}>50-80 words</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.lengthOption, styles.mediumLength]}
                  onPress={async () => {
                    if (aiPrompt.trim()) {
                      const aiContent = await generateAiContent(aiPrompt, 'medium');
                      setContent(aiContent);
                      setShowAiWriter(false);
                    } else {
                      showAlert('Prompt Required', 'Please enter what you want to write about');
                    }
                  }}
                  disabled={isGeneratingAi}
                >
                  <Ionicons name="newspaper" size={24} color="white" />
                  <Text style={styles.lengthOptionText}>Medium</Text>
                  <Text style={styles.lengthOptionSubtext}>100-150 words</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.lengthOption, styles.longLength]}
                  onPress={async () => {
                    if (aiPrompt.trim()) {
                      const aiContent = await generateAiContent(aiPrompt, 'long');
                      setContent(aiContent);
                      setShowAiWriter(false);
                    } else {
                      showAlert('Prompt Required', 'Please enter what you want to write about');
                    }
                  }}
                  disabled={isGeneratingAi}
                >
                  <Ionicons name="document-text" size={24} color="white" />
                  <Text style={styles.lengthOptionText}>Long</Text>
                  <Text style={styles.lengthOptionSubtext}>200+ words</Text>
                </TouchableOpacity>
              </View>
              
              {isGeneratingAi && (
                <View style={styles.generatingContainer}>
                  <ActivityIndicator size="small" color="#3B82F6" />
                  <Text style={styles.generatingText}>Generating AI content...</Text>
                </View>
              )}
              
              {/* Writing Style Selector */}
              <View style={styles.styleSelectorSection}>
                <Text style={styles.sectionLabel}>Writing Style:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
                  {[
                    { id: 'friendly', name: '😊 Friendly', color: '#10B981' },
                    { id: 'professional', name: '💼 Professional', color: '#3B82F6' },
                    { id: 'casual', name: '😎 Casual', color: '#F59E0B' },
                    { id: 'inspirational', name: '✨ Inspirational', color: '#8B5CF6' },
                    { id: 'humorous', name: '😄 Humorous', color: '#EF4444' },
                    { id: 'educational', name: '📚 Educational', color: '#06B6D4' },
                    { id: 'storytelling', name: '📖 Story', color: '#F97316' }
                  ].map((style) => (
                    <TouchableOpacity
                      key={style.id}
                      style={[styles.optionChip, selectedWritingStyle === style.id && { backgroundColor: style.color }]}
                      onPress={() => setSelectedWritingStyle(style.id)}
                    >
                      <Text style={[styles.optionChipText, selectedWritingStyle === style.id && { color: 'white' }]}>{style.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              {/* Content Type Selector */}
              <View style={styles.styleSelectorSection}>
                <Text style={styles.sectionLabel}>Content Type:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
                  {[
                    { id: 'post', name: '📝 Post', color: '#3B82F6' },
                    { id: 'quote', name: '💭 Quote', color: '#8B5CF6' },
                    { id: 'tip', name: '💡 Tip', color: '#10B981' },
                    { id: 'question', name: '❓ Question', color: '#F59E0B' },
                    { id: 'story', name: '📚 Story', color: '#EF4444' },
                    { id: 'fact', name: '🔬 Fact', color: '#06B6D4' }
                  ].map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      style={[styles.optionChip, selectedContentType === type.id && { backgroundColor: type.color }]}
                      onPress={() => setSelectedContentType(type.id)}
                    >
                      <Text style={[styles.optionChipText, selectedContentType === type.id && { color: 'white' }]}>{type.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.aiQuickPrompts}>
                <Text style={styles.quickPromptsLabel}>Topic Ideas:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPromptsContainer}>
                  {[
                    'Success & Growth',
                    'Technology Trends',
                    'Life Lessons',
                    'Creative Process',
                    'Business Insights',
                    'Personal Journey',
                    'Innovation',
                    'Mindfulness',
                    'Leadership',
                    'Productivity',
                    'Relationships',
                    'Learning'
                  ].map((prompt, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quickPromptChip}
                      onPress={() => setAiPrompt(prompt)}
                    >
                      <Text style={styles.quickPromptChipText}>{prompt}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}

          {/* Selected Files Display */}
          {selectedFiles.length > 0 && (
            <View style={styles.filesContainer}>
              <View style={styles.filesHeader}>
                <MaterialIcons name="attach-file" size={20} color="#3B82F6" />
                <Text style={styles.filesTitle}>Attached Files ({selectedFiles.length})</Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedFiles.map((file, index) => {
                  const category = getFileCategory(file.name);
                  return (
                    <View key={index} style={styles.fileItem}>
                      <View style={[styles.fileIconContainer, { backgroundColor: category.color + '20' }]}>
                        <MaterialIcons 
                          name={category.icon as any} 
                          size={24} 
                          color={category.color} 
                        />
                      </View>
                      <View style={[styles.fileCategoryBadge, { backgroundColor: category.color }]}>
                        <Text style={styles.fileCategoryText}>{category.type.toUpperCase()}</Text>
                      </View>
                      <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                      <Text style={styles.fileSize}>{formatFileSize(file.size || 0)}</Text>
                      <TouchableOpacity 
                        style={styles.removeFileButton}
                        onPress={() => removeFile(index)}
                      >
                        <MaterialIcons name="close" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Selected GIF Preview */}
          {selectedGif && (
            <View style={styles.gifPreview}>
              <Image source={{ uri: selectedGif }} style={styles.previewGif} />
              <TouchableOpacity 
                style={styles.removeGifButton}
                onPress={removeGif}
              >
                <MaterialIcons name="close" size={20} color="white" />
              </TouchableOpacity>
              <View style={styles.gifBadge}>
                <Text style={styles.gifBadgeText}>GIF</Text>
              </View>
            </View>
          )}

          {/* Selected Location Display */}
          {selectedLocation && (
            <View style={styles.locationContainer}>
              <View style={styles.locationHeader}>
                <MaterialIcons name="location-on" size={20} color="#EF4444" />
                <Text style={styles.locationTitle}>Location Added</Text>
                <TouchableOpacity onPress={removeLocation}>
                  <MaterialIcons name="close" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              <Text style={styles.locationName}>{selectedLocation.name}</Text>
            </View>
          )}

          {/* Poll Creator */}
          {showPollCreator && (
            <View style={styles.pollCreator}>
              <View style={styles.pollHeader}>
                <MaterialIcons name="poll" size={20} color="#3B82F6" />
                <Text style={styles.pollTitle}>Create Poll</Text>
                <TouchableOpacity onPress={() => setShowPollCreator(false)}>
                  <MaterialIcons name="close" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              
              {pollOptions.map((option, index) => (
                <View key={index} style={styles.pollOptionContainer}>
                  <TextInput
                    style={styles.pollOptionInput}
                    placeholder={`Option ${index + 1}`}
                    placeholderTextColor="#9CA3AF"
                    value={option}
                    onChangeText={(text) => updatePollOption(index, text)}
                    maxLength={50}
                  />
                  {pollOptions.length > 2 && (
                    <TouchableOpacity onPress={() => removePollOption(index)}>
                      <MaterialIcons name="remove-circle" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              
              <View style={styles.pollActions}>
                {pollOptions.length < 4 && (
                  <TouchableOpacity onPress={addPollOption} style={styles.addPollOption}>
                    <MaterialIcons name="add" size={16} color="#3B82F6" />
                    <Text style={styles.addPollOptionText}>Add Option</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity onPress={createPoll} style={styles.createPollButton}>
                  <Text style={styles.createPollButtonText}>Create Poll</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Selected Image Preview */}
          {selectedImage && (
            <View style={styles.imagePreview}>
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => {
                  setSelectedImage(null);
                  setAiAnalysis(null);
                  setDetectedObjects([]);
                }}
              >
                <MaterialIcons name="close" size={20} color="white" />
              </TouchableOpacity>
              {isAnalyzingImage && (
                <View style={styles.analysisOverlay}>
                  <ActivityIndicator size="large" color="#3B82F6" />
                  <Text style={styles.analysisText}>AI Analyzing Image...</Text>
                </View>
              )}
            </View>
          )}

          {/* AI Analysis Results */}
          {aiAnalysis && (
            <View style={styles.aiAnalysisCard}>
              <View style={styles.aiAnalysisHeader}>
                <MaterialIcons name="auto-fix-high" size={20} color="#3B82F6" />
                <Text style={styles.aiAnalysisTitle}>AI Analysis Results</Text>
              </View>
              <Text style={styles.aiAnalysisText}>
                Detected: {aiAnalysis.detectedObjects.join(', ')}
              </Text>
              <Text style={styles.aiAnalysisText}>
                Scene: {aiAnalysis.sceneType}
              </Text>
              <Text style={styles.aiAnalysisText}>
                Mood: {aiAnalysis.mood}
              </Text>
              <Text style={styles.aiAnalysisText}>
                Confidence: {Math.round(aiAnalysis.confidence * 100)}%
              </Text>
            </View>
          )}

          {/* Live Stream Toggle */}
          <View style={styles.liveToggle}>
            <TouchableOpacity 
              style={[styles.liveButton, isLive && styles.liveButtonActive]}
              onPress={() => setIsLive(!isLive)}
            >
              <MaterialIcons 
                name="videocam" 
                size={20} 
                color={isLive ? 'white' : '#9CA3AF'} 
              />
              <Text style={[styles.liveButtonText, isLive && styles.liveButtonTextActive]}>
                {isLive ? 'Live Stream' : 'Go Live'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Simple Hashtags Section */}
          <View style={styles.hashtagSection}>
            <View style={styles.hashtagHeader}>
              <Text style={styles.hashtagTitle}>Hashtags</Text>
              <TouchableOpacity 
                onPress={generateSmartHashtags}
                disabled={isGeneratingHashtags}
                style={styles.generateButton}
              >
                {isGeneratingHashtags ? (
                  <ActivityIndicator size="small" color="#3B82F6" />
                ) : (
                  <MaterialIcons name="auto-fix-high" size={16} color="#3B82F6" />
                )}
                <Text style={styles.generateButtonText}>
                  {isGeneratingHashtags ? 'Generating...' : 'Generate'}
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.hashtagContainer}>
              {hashtags.map((hashtag, index) => (
                <View key={index} style={styles.hashtag}>
                  <Text style={styles.hashtagText}>{hashtag}</Text>
                  <TouchableOpacity 
                    onPress={() => removeHashtag(index)}
                    style={styles.removeHashtag}
                  >
                    <MaterialIcons name="close" size={14} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity onPress={addTrendingHashtags} style={styles.addHashtag}>
                <MaterialIcons name="trending-up" size={16} color="#10B981" />
                <Text style={styles.addHashtagText}>Popular</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Media Options */}
          <View style={styles.mediaOptions}>
            <TouchableOpacity onPress={pickImage} style={styles.mediaButton}>
              <MaterialIcons name="photo" size={24} color="#3B82F6" />
              <Text style={styles.mediaButtonText}>Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={pickDocument} style={styles.mediaButton}>
              <MaterialIcons name="attach-file" size={24} color="#10B981" />
              <Text style={[styles.mediaButtonText, { color: '#10B981' }]}>Files</Text>
              <Text style={[styles.mediaButtonSubtext, { color: '#10B981' }]}>100+ types</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={pickGif} style={styles.mediaButton}>
              <MaterialIcons name="gif" size={24} color="#F59E0B" />
              <Text style={[styles.mediaButtonText, { color: '#F59E0B' }]}>GIF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setShowPollCreator(true)} style={styles.mediaButton}>
              <MaterialIcons name="poll" size={24} color="#8B5CF6" />
              <Text style={[styles.mediaButtonText, { color: '#8B5CF6' }]}>Poll</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => setShowAiWriter(true)} 
              style={[styles.mediaButton, showAiWriter && styles.mediaButtonActive]}
            >
              <Ionicons name="bulb" size={24} color={showAiWriter ? "white" : "#FF6B6B"} />
              <Text style={[styles.mediaButtonText, { color: showAiWriter ? "white" : '#FF6B6B' }]}>AI Write</Text>
            </TouchableOpacity>
          </View>

          {/* GIF Picker Modal */}
          {showGifPicker && (
            <View style={styles.gifPickerModal}>
              <View style={styles.gifPickerHeader}>
                <Text style={styles.gifPickerTitle}>Choose GIF</Text>
                <TouchableOpacity onPress={() => setShowGifPicker(false)}>
                  <MaterialIcons name="close" size={24} color="white" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.gifGrid}>
                <View style={styles.gifRow}>
                  {/* Sample GIFs - in real app would fetch from GIPHY API */}
                  {[
                    'https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif',
                    'https://media.giphy.com/media/26AHPxxnSw1L9T1rW/giphy.gif',
                    'https://media.giphy.com/media/3o6Zt4HU9uwXmXSAuI/giphy.gif',
                    'https://media.giphy.com/media/l1J9FiGxR61OcF2mI/giphy.gif'
                  ].map((gifUrl, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={styles.gifOption}
                      onPress={() => selectGif(gifUrl)}
                    >
                      <Image source={{ uri: gifUrl }} style={styles.gifThumbnail} />
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#374151',
  },
  postButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  postButtonTextDisabled: {
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userHandle: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  contentInputContainer: {
    position: 'relative',
  },
  contentInput: {
    color: 'white',
    fontSize: 18,
    minHeight: 120,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  contentInputCollapsed: {
    maxHeight: 140,
    overflow: 'hidden',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
    marginBottom: 8,
  },
  showMoreText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  characterCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  characterCount: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  previewInfo: {
    color: '#6B7280',
    fontSize: 12,
    fontStyle: 'italic',
  },
  aiWriterPanel: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  aiWriterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  aiWriterTitle: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  aiPromptInput: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  aiLengthOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  lengthOption: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  shortLength: {
    backgroundColor: '#3B82F6',
  },
  mediumLength: {
    backgroundColor: '#10B981',
  },
  longLength: {
    backgroundColor: '#F59E0B',
  },
  lengthOptionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  lengthOptionSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: 2,
  },
  generatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  generatingText: {
    color: '#9CA3AF',
    marginLeft: 8,
    fontSize: 14,
  },
  aiQuickPrompts: {
    marginTop: 8,
  },
  quickPromptsLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  quickPromptsContainer: {
    flexDirection: 'row',
  },
  quickPromptChip: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  quickPromptChipText: {
    color: '#D1D5DB',
    fontSize: 12,
  },
  styleSelectorSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
  },
  optionChip: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  optionChipText: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '500',
  },
  mediaButtonActive: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    padding: 4,
  },
  imagePreview: {
    position: 'relative',
    marginBottom: 16,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  analysisText: {
    color: 'white',
    marginTop: 12,
    fontSize: 16,
  },
  aiAnalysisCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  aiAnalysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiAnalysisTitle: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  aiAnalysisText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 4,
  },
  liveToggle: {
    marginBottom: 20,
  },
  liveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  liveButtonActive: {
    backgroundColor: '#EF4444',
  },
  liveButtonText: {
    color: '#9CA3AF',
    marginLeft: 8,
    fontWeight: '500',
  },
  liveButtonTextActive: {
    color: 'white',
  },
  hashtagSection: {
    marginBottom: 20,
  },
  hashtagHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  hashtagTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  hashtagActions: {
    flexDirection: 'row',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  generateButtonText: {
    color: '#3B82F6',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  trendingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trendingButtonText: {
    color: '#10B981',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  hashtagContainer: {
    flexDirection: 'row',
  },
  hashtag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  hashtagText: {
    color: '#3B82F6',
    fontSize: 14,
  },
  removeHashtag: {
    marginLeft: 6,
  },
  addHashtag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
  },
  addHashtagText: {
    color: '#3B82F6',
    fontSize: 14,
    marginLeft: 4,
  },
  detectedObjectsSection: {
    marginTop: 12,
  },
  detectedObjectsTitle: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  detectedObjectsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detectedObject: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#065F46',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  detectedObjectText: {
    color: '#10B981',
    fontSize: 12,
    marginLeft: 4,
  },
  mediaOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#374151',
  },
  mediaButton: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
  },
  mediaButtonText: {
    color: '#3B82F6',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  mediaButtonSubtext: {
    fontSize: 10,
    marginTop: 1,
    opacity: 0.7,
  },
  filesContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  filesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  filesTitle: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  fileItem: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    width: 100,
    position: 'relative',
  },
  fileIconContainer: {
    alignItems: 'center',
    marginBottom: 4,
    borderRadius: 8,
    padding: 8,
  },
  fileCategoryBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  fileCategoryText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  fileName: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 2,
  },
  fileSize: {
    color: '#9CA3AF',
    fontSize: 8,
    textAlign: 'center',
  },
  removeFileButton: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gifPreview: {
    position: 'relative',
    marginBottom: 16,
  },
  previewGif: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeGifButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gifBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gifBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  locationContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  locationTitle: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  locationName: {
    color: '#D1D5DB',
    fontSize: 16,
    fontWeight: '500',
  },
  pollCreator: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  pollHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  pollTitle: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  pollOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  pollOptionInput: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    fontSize: 14,
  },
  pollActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  addPollOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 4,
  },
  addPollOptionText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '500',
  },
  createPollButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  createPollButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  gifPickerModal: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    maxHeight: 300,
  },
  gifPickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  gifPickerTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  gifGrid: {
    flex: 1,
  },
  gifRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gifOption: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gifThumbnail: {
    width: '100%',
    height: '100%',
  },
});