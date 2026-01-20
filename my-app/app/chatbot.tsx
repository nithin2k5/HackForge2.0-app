import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeInRight,
  FadeInLeft,
  Layout,
  LayoutAnimation,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const quickReplies = [
  'How do I apply for a job?',
  'How does AI matching work?',
  'How to update my profile?',
  'View saved jobs',
];

const botResponses: { [key: string]: string } = {
  'hello': 'Hello! I\'m Chilli. How can I help you today?',
  'hi': 'Hi there! I\'m Chilli, here to help you with jobs, applications, and more. What would you like to know?',
  'help': 'I can help you with:\n• Finding and applying for jobs\n• Understanding AI matching\n• Managing your profile\n• Saved jobs and applications\n• General questions about GROEI\n\nWhat would you like to know?',
  'how do i apply for a job?': 'To apply for a job:\n1. Browse jobs from the Jobs section\n2. Click on a job you\'re interested in\n3. Review the job details\n4. Click "Apply Now" button\n5. Fill out the application form\n6. Submit your application\n\nYou can track your applications in the Applications section!',
  'how does ai matching work?': 'Our AI matching works by:\n1. Analyzing your uploaded resume\n2. Extracting your skills and experience\n3. Matching them with job requirements\n4. Calculating a match percentage\n5. Recommending the best opportunities\n\nThe higher the match percentage, the better the fit!',
  'how to update my profile?': 'To update your profile:\n1. Go to Dashboard\n2. Click on Settings\n3. Select "Edit Profile"\n4. Update your information\n5. Save changes\n\nYou can also manage your resume from Settings > Manage Resume.',
  'view saved jobs': 'To view your saved jobs:\n1. Go to Dashboard\n2. Click on "Saved Jobs" in the menu\n3. Browse your saved opportunities\n\nYou can also access it from the Jobs section.',
  'default': 'I understand you\'re asking about that. Let me help you:\n\n• For job applications, go to the Jobs section\n• For profile updates, check Settings\n• For help, visit Help Center\n• For support, use Contact Us\n\nIs there something specific I can help with?',
};

export default function ChatbotScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m Chilli, your GROEI AI Assistant. I can help you with jobs, applications, and career growth. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase().trim();

    for (const [key, response] of Object.entries(botResponses)) {
      if (lowerMessage.includes(key.toLowerCase())) {
        return response;
      }
    }

    if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
      return botResponses['how do i apply for a job?'];
    }
    if (lowerMessage.includes('match') || lowerMessage.includes('ai')) {
      return botResponses['how does ai matching work?'];
    }
    if (lowerMessage.includes('profile') || lowerMessage.includes('update')) {
      return botResponses['how to update my profile?'];
    }
    if (lowerMessage.includes('saved') || lowerMessage.includes('bookmark')) {
      return botResponses['view saved jobs'];
    }

    return botResponses['default'];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(userMessage.text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1200);
  };

  const handleQuickReply = (reply: string) => {
    setInputText(reply);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="dark-content" />

      {/* Dynamic Background Elements */}
      <View style={styles.backgroundContainer}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* Glass Header */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="apps" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.avatarWrapper}>
              <View style={styles.botAvatar}>
                <Ionicons name="sparkles" size={20} color={COLORS.WHITE} />
              </View>
              <View style={styles.onlineBadge} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>Chilli AI</Text>
              <Text style={styles.headerSubtitle}>Personal Career Guide</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <View style={styles.headerActionBtn}>
              <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.PRIMARY} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => (
              <Animated.View
                key={message.id}
                entering={message.sender === 'user' ? FadeInRight.delay(100) : FadeInLeft.delay(100)}
                layout={Layout.springify()}
                style={[
                  styles.messageWrapper,
                  message.sender === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper,
                ]}
              >
                {message.sender === 'bot' && (
                  <View style={styles.botAvatarSmall}>
                    <Ionicons name="sparkles" size={14} color={COLORS.WHITE} />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    message.sender === 'user' ? styles.userBubble : styles.botBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === 'user' ? styles.userMessageText : styles.botMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                  <Text
                    style={[
                      styles.messageTime,
                      message.sender === 'user' ? styles.userMessageTime : styles.botMessageTime,
                    ]}
                  >
                    {formatTime(message.timestamp)}
                  </Text>
                </View>
              </Animated.View>
            ))}

            {isTyping && (
              <Animated.View
                entering={FadeInLeft}
                style={[styles.messageWrapper, styles.botMessageWrapper]}
              >
                <View style={styles.botAvatarSmall}>
                  <Ionicons name="sparkles" size={14} color={COLORS.WHITE} />
                </View>
                <View style={[styles.messageBubble, styles.botBubble, styles.typingBubble]}>
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                    <View style={styles.typingDot} />
                  </View>
                </View>
              </Animated.View>
            )}
          </ScrollView>

          {/* Quick Replies - Floating Pill Style */}
          {messages.length < 5 && (
            <Animated.View entering={FadeInUp.delay(200)} style={styles.quickRepliesSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRepliesContent}>
                {quickReplies.map((reply, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.quickReplyButton}
                    onPress={() => handleQuickReply(reply)}
                  >
                    <Text style={styles.quickReplyText}>{reply}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Animated.View>
          )}

          {/* Glass Input Bar */}
          <Animated.View entering={FadeInUp.duration(600)} style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Ask Chilli anything..."
                placeholderTextColor={COLORS.TEXT_SECONDARY + '80'}
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                onPress={handleSendMessage}
                disabled={!inputText.trim()}
              >
                <Ionicons
                  name="send"
                  size={20}
                  color={COLORS.WHITE}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: -1,
  },
  bgCircle1: {
    position: 'absolute',
    width: screenWidth * 1.5,
    height: screenWidth * 1.5,
    borderRadius: screenWidth * 0.75,
    backgroundColor: COLORS.PRIMARY + '08',
    top: -screenWidth * 0.5,
    right: -screenWidth * 0.5,
  },
  bgCircle2: {
    position: 'absolute',
    width: screenWidth * 1.2,
    height: screenWidth * 1.2,
    borderRadius: screenWidth * 0.6,
    backgroundColor: COLORS.SECONDARY + '10',
    bottom: -screenWidth * 0.3,
    left: -screenWidth * 0.3,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 24,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  botAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981', // Emerald 500
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.TEXT_PRIMARY,
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '600',
  },
  moreButton: {
    padding: 2,
  },
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-end',
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  botMessageWrapper: {
    justifyContent: 'flex-start',
  },
  botAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 2,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  userBubble: {
    backgroundColor: COLORS.PRIMARY,
    borderBottomRightRadius: 4,
    shadowColor: COLORS.PRIMARY,
    shadowOpacity: 0.2,
    elevation: 5,
  },
  botBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  userMessageText: {
    color: COLORS.WHITE,
  },
  botMessageText: {
    color: COLORS.TEXT_PRIMARY,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 6,
    fontWeight: '600',
  },
  userMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  botMessageTime: {
    color: COLORS.TEXT_SECONDARY,
  },
  typingBubble: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.PRIMARY,
    opacity: 0.6,
  },
  quickRepliesSection: {
    paddingVertical: 12,
  },
  quickRepliesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  quickReplyButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  quickReplyText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.PRIMARY,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 56,
    maxHeight: 120,
    shadowColor: COLORS.PRIMARY,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.TEXT_PRIMARY,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    fontWeight: '500',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.SECONDARY + '80',
    opacity: 0.6,
  },
});
