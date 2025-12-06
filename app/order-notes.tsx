// oneQlick/app/order-notes.tsx (STABLE FIX: Safe Area and Input Collision)

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AppHeader from '../components/common/AppHeader'; 
import { MaterialIcons } from '@expo/vector-icons';
// 🔑 ADDED: Import useSafeAreaInsets
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

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
const ChatBubble = ({ message }: { message: Message }) => {
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
    
    // 🔑 ADDED: Get safe area insets
    const insets = useSafeAreaInsets();

    // Scroll to bottom whenever messages change
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
            sender: 'user', // Assume the user is sending the message
            text: inputText.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        Keyboard.dismiss(); 
    }, [inputText, messages.length]);


    return (
        // NOTE: We wrap everything in View/Fragment and apply padding to the input bar
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} // Removed Android 'height' behavior
            keyboardVerticalOffset={0}
        >
            <AppHeader 
                title={`Order # ${orderId} Notes`} 
                showBack={true} 
            />
            
            <ScrollView 
                ref={scrollViewRef}
                style={styles.chatArea}
                contentContainerStyle={styles.chatContent}
                showsVerticalScrollIndicator={false}
            >
                {messages.map(message => (
                    <ChatBubble key={message.id} message={message} />
                ))}
            </ScrollView>

            {/* 🔑 FIXED INPUT BAR: Apply bottom padding equal to system safe area */}
            <View style={[styles.inputContainer, { paddingBottom: insets.bottom || 10 }]}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type a message or note..."
                    value={inputText}
                    onChangeText={setInputText}
                    onSubmitEditing={handleSend}
                    blurOnSubmit={false}
                />
                <TouchableOpacity 
                    style={[styles.sendButton, { backgroundColor: inputText.trim() ? '#4F46E5' : '#ccc' }]}
                    onPress={handleSend}
                    disabled={inputText.trim() === ''}
                >
                    <MaterialIcons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

// --- Styles ---
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#f5f5f5', 
    },
    chatArea: {
        flex: 1,
    },
    chatContent: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    // Bubble Styles
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
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    userBubble: {
        backgroundColor: '#D1E5F8', // Light Blue/User Color
        borderBottomRightRadius: 2,
    },
    partnerBubble: {
        backgroundColor: '#fff', // White/Partner Color
        borderBottomLeftRadius: 2,
    },
    userText: {
        fontSize: 15,
        color: '#1F2937',
    },
    partnerText: {
        fontSize: 15,
        color: '#1F2937',
    },
    timestamp: {
        fontSize: 10,
        color: '#999',
        alignSelf: 'flex-end',
        marginTop: 4,
    },

    // Input Styles
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 10, // Changed from padding: 10 to horizontal for control
        paddingTop: 10, // Ensure padding top is always 10
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        alignItems: 'center',
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
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