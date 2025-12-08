// oneQlick/app/order-notes.tsx (I18N and THEME-AWARE)

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AppHeader from '../components/common/AppHeader'; 
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useTheme } from '../contexts/ThemeContext'; 
import { useLanguage } from '../contexts/LanguageContext'; 

// --- Mock Data and Interfaces ---
interface Message {
 id: number;
 sender: 'user' | 'partner';
 text: string;
 timestamp: string;
}

const MOCK_CHAT_HISTORY: Message[] = [
    { id: 1, sender: 'partner', text: "Please confirm order preparation is underway. ETA?", timestamp: "10:05 AM" },
    { id: 2, sender: 'user', text: "Just waiting on the tandoor bread. Should be ready in 5 mins.", timestamp: "10:07 AM" },
 { id: 3, sender: 'partner', text: "Understood. Thanks!", timestamp: "10:07 AM" },
];

// --- Helper Component: Chat Bubble ---
const ChatBubble = ({ message, styles }: { message: Message, styles: any }) => {
    const isUser = message.sender === 'user';
    
    return (
        <View style={[styles.bubbleContainer, isUser ? styles.userContainer : styles.partnerContainer]}>
            <View style={[styles.bubble, isUser ? styles.userBubble : styles.partnerBubble]}>
                <Text style={isUser ? styles.userText : styles.partnerText}>{message.text}</Text>
                <Text style={styles.timestamp}>{message.timestamp}</Text>
            </View>
        </View>
    );
};


// --- Main Component ---
export default function OrderNotesScreen() {
    const params = useLocalSearchParams();
    const orderId = params.orderId || 'RO-123'; 
    
    const [messages, setMessages] = useState<Message[]>(MOCK_CHAT_HISTORY); 
    const [inputText, setInputText] = useState('');
    const scrollViewRef = React.useRef<ScrollView>(null);
    
    const insets = useSafeAreaInsets();
    const { theme } = useTheme();
    const { t } = useLanguage();

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    const handleSend = useCallback(() => {
        if (inputText.trim() === '') return;

        const newId = messages.length + 1;
        const newMessage: Message = {
            id: newId,
            sender: 'user', 
            text: inputText.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        Keyboard.dismiss(); 
    }, [inputText, messages.length]);

    // 🔑 Dynamic Styles Definition
    const dynamicStyles = StyleSheet.create({
        container: { 
            flex: 1, 
            backgroundColor: theme === 'dark' ? '#121212' : '#f5f5f5', 
        },
        chatArea: {
            flex: 1,
        },
        chatContent: {
            paddingHorizontal: 15,
            paddingVertical: 10,
        },

        bubbleContainer: {
            flexDirection: 'row',
            marginVertical: 4,
        },
        userContainer: {
            justifyContent: 'flex-end',
        },
        partnerContainer: {
            justifyContent: 'flex-start',
        },
        bubble: {
            maxWidth: '80%',
            padding: 10,
            borderRadius: 15,
            elevation: 1,
            shadowColor: '#000',
            shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
            shadowRadius: 1,
        },
        userBubble: {
            backgroundColor: theme === 'dark' ? '#004d80' : '#D1E5F8', 
            borderBottomRightRadius: 2,
        },
        partnerBubble: {
            backgroundColor: theme === 'dark' ? '#1E1E1E' : '#fff', 
            borderBottomLeftRadius: 2,
            borderWidth: theme === 'dark' ? 1 : 0,
            borderColor: theme === 'dark' ? '#333' : 'transparent',
        },
        userText: {
            fontSize: 15,
            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
        },
        partnerText: {
            fontSize: 15,
            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
        },
        timestamp: {
            fontSize: 10,
            color: theme === 'dark' ? '#777' : '#999',
            alignSelf: 'flex-end',
            marginTop: 4,
        },

        inputContainer: {
            flexDirection: 'row',
            paddingHorizontal: 10,
            paddingTop: 10,
            backgroundColor: theme === 'dark' ? '#1E1E1E' : 'white',
            borderTopWidth: 1,
            borderTopColor: theme === 'dark' ? '#333' : '#eee',
            alignItems: 'center',
        },
        textInput: {
            flex: 1,
            borderWidth: 1,
            borderColor: theme === 'dark' ? '#555' : '#ccc',
            backgroundColor: theme === 'dark' ? '#292929' : 'white',
            color: theme === 'dark' ? '#FFFFFF' : '#1F2937',
            borderRadius: 25,
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginRight: 10,
            fontSize: 16,
        },
        sendButton: {
            width: 45,
            height: 45,
            borderRadius: 22.5,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });


    return (
        <KeyboardAvoidingView 
            style={dynamicStyles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
            keyboardVerticalOffset={0}
        >
            <AppHeader 
                title={`${t('order_hash')} ${orderId} ${t('notes')}`} 
                showBack={true} 
            />
            
            <ScrollView 
                ref={scrollViewRef}
                style={dynamicStyles.chatArea}
                contentContainerStyle={dynamicStyles.chatContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.map(message => (
                    <ChatBubble key={message.id} message={message} styles={dynamicStyles} />
                ))}
            </ScrollView>

            {/* FIXED INPUT BAR: Apply bottom padding equal to system safe area */}
            <View style={[dynamicStyles.inputContainer, { paddingBottom: insets.bottom || 10 }]}>
                <TextInput
                    style={dynamicStyles.textInput}
                    placeholder={t("type_message_note")}
                    placeholderTextColor={theme === 'dark' ? '#999' : '#888'}
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={handleSend}
                    blurOnSubmit={false}
                />
                <TouchableOpacity 
                    style={[dynamicStyles.sendButton, { backgroundColor: inputText.trim() ? '#4F46E5' : theme === 'dark' ? '#555' : '#ccc' }]}
                    onPress={handleSend}
                    disabled={inputText.trim() === ''}
                >
                    <MaterialIcons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
