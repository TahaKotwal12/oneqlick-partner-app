import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Alert,
  Dimensions,
  BackHandler,
} from 'react-native';
import {
  Text,
  Surface,
  Button,
  IconButton,
  Chip,
  Divider,
  FAB,
  Dialog,
  Portal,
  List,
  Switch,
} from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import {
  samplePaymentMethods,
  availablePaymentOptions,
  samplePaymentHistory,
  formatAmount,
  formatDate,
  formatTime,
  getPaymentStatusColor,
  getPaymentStatusIcon,
  getVerificationStatus,
  PaymentMethod,
  PaymentOption,
} from './paymentData';

const { width, height } = Dimensions.get('window');

export default function PaymentMethodsScreen() {
  const router = useRouter();
  
  // State management
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(samplePaymentMethods);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingPaymentMethod, setDeletingPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  
  // Animation values
  const listAnim = useRef(new Animated.Value(0)).current;
  const fabAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    startAnimations();
  }, []);

  // Handle back button press
  useEffect(() => {
    const backAction = () => {
      // Navigate back to profile screen
      router.back();
      return true; // Prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [router]);

  const startAnimations = () => {
    // Header slide down animation
    Animated.timing(headerAnim, { 
      toValue: 1, 
      duration: 600, 
      useNativeDriver: true 
    }).start();
    
    // List fade in animation
    Animated.timing(listAnim, { 
      toValue: 1, 
      duration: 800, 
      useNativeDriver: true 
    }).start();
    
    // FAB bounce animation
    Animated.sequence([
      Animated.delay(500),
      Animated.spring(fabAnim, { 
        toValue: 1, 
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  };

  const handleAddPaymentMethod = () => {
    setShowAddDialog(true);
  };

  const handlePaymentOptionSelect = (option: PaymentOption) => {
    setShowAddDialog(false);
    
    // TODO: Navigate to specific add payment method screens
    switch (option.type) {
      case 'card':
        Alert.alert('Add Card', 'Card addition screen coming soon!');
        break;
      case 'upi':
        Alert.alert('Add UPI', 'UPI addition screen coming soon!');
        break;
      case 'wallet':
        Alert.alert('Add Wallet', 'Wallet addition screen coming soon!');
        break;
      case 'netbanking':
        Alert.alert('Add Net Banking', 'Net banking screen coming soon!');
        break;
      case 'cod':
        Alert.alert('Cash on Delivery', 'COD is always available for all orders!');
        break;
    }
  };

  const handleSetDefault = (paymentMethod: PaymentMethod) => {
    setPaymentMethods(prev => 
      prev.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethod.id,
      }))
    );
    
    Alert.alert('Success', `${paymentMethod.displayName} set as default payment method!`);
  };

  const handleDeletePaymentMethod = (paymentMethod: PaymentMethod) => {
    if (paymentMethod.isDefault) {
      Alert.alert('Error', 'Cannot delete default payment method. Set another method as default first.');
      return;
    }
    
    setDeletingPaymentMethod(paymentMethod);
    setShowDeleteDialog(true);
  };

  const confirmDeletePaymentMethod = () => {
    if (deletingPaymentMethod) {
      setPaymentMethods(prev => prev.filter(pm => pm.id !== deletingPaymentMethod.id));
      setShowDeleteDialog(false);
      setDeletingPaymentMethod(null);
      Alert.alert('Success', 'Payment method removed successfully!');
    }
  };

  const handlePaymentHistory = () => {
    setShowPaymentHistory(true);
  };

  const renderHeader = () => (
    <Animated.View 
      style={[
        styles.header,
        {
          transform: [{
            translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0],
            }),
          }],
        },
      ]}
    >
      <IconButton
        icon="arrow-back"
        size={24}
        iconColor="#1F2937"
        onPress={() => router.back()}
      />
      <Text style={styles.headerTitle}>Payment Methods</Text>
      <IconButton
        icon="history"
        size={24}
        iconColor="#6B7280"
        onPress={handlePaymentHistory}
      />
    </Animated.View>
  );

  const renderPaymentMethodCard = (paymentMethod: PaymentMethod) => (
    <Animated.View
      key={paymentMethod.id}
      style={[
        styles.paymentCard,
        {
          opacity: listAnim,
          transform: [{
            translateY: listAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        },
      ]}
    >
      <Surface style={styles.paymentSurface}>
        {/* Payment Method Header */}
        <View style={styles.paymentHeader}>
          <View style={styles.paymentInfo}>
            <View style={[styles.paymentIcon, { backgroundColor: paymentMethod.brandColor }]}>
              <MaterialIcons 
                name={paymentMethod.icon as any} 
                size={24} 
                color="white" 
              />
            </View>
            
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentName}>{paymentMethod.displayName}</Text>
              
              {paymentMethod.maskedNumber && (
                <Text style={styles.paymentNumber}>{paymentMethod.maskedNumber}</Text>
              )}
              
              {paymentMethod.upiId && (
                <Text style={styles.paymentUpi}>{paymentMethod.upiId}</Text>
              )}
              
              {paymentMethod.bankName && (
                <Text style={styles.paymentBank}>{paymentMethod.bankName}</Text>
              )}
              
              {paymentMethod.cardType && (
                <Text style={styles.paymentCardType}>
                  {paymentMethod.cardType.charAt(0).toUpperCase() + paymentMethod.cardType.slice(1)} Card
                </Text>
              )}
              
              {paymentMethod.expiryDate && (
                <Text style={styles.paymentExpiry}>Expires {paymentMethod.expiryDate}</Text>
              )}
              
              {paymentMethod.balance && (
                <Text style={styles.paymentBalance}>
                  Balance: {formatAmount(paymentMethod.balance)}
                </Text>
              )}
            </View>
          </View>
          
          <View style={styles.paymentActions}>
            {/* Verification Status */}
            <Chip
              mode="flat"
              textStyle={{ color: 'white' }}
              style={[
                styles.verificationChip,
                { backgroundColor: getVerificationStatus(paymentMethod.isVerified).color }
              ]}
              icon={getVerificationStatus(paymentMethod.isVerified).icon}
              compact
            >
              {getVerificationStatus(paymentMethod.isVerified).text}
            </Chip>
            
            {/* Default Badge */}
            {paymentMethod.isDefault && (
              <Chip mode="flat" textStyle={{ color: 'white' }} style={styles.defaultChip} compact>
                Default
              </Chip>
            )}
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Payment Method Footer */}
        <View style={styles.paymentFooter}>
          <View style={styles.paymentMeta}>
            {paymentMethod.lastUsed && (
              <Text style={styles.lastUsed}>
                Last used: {formatDate(paymentMethod.lastUsed)}
              </Text>
            )}
          </View>
          
          <View style={styles.paymentButtons}>
            {!paymentMethod.isDefault && (
              <Button
                mode="outlined"
                onPress={() => handleSetDefault(paymentMethod)}
                icon="star"
                style={styles.actionButton}
                compact
              >
                Set Default
              </Button>
            )}
            
            <Button
              mode="outlined"
              onPress={() => handleDeletePaymentMethod(paymentMethod)}
              icon="delete"
              style={styles.actionButton}
              compact
              textColor="#EF4444"
            >
              Remove
            </Button>
          </View>
        </View>
      </Surface>
    </Animated.View>
  );

  const renderAddPaymentDialog = () => (
    <Portal>
      <Dialog
        visible={showAddDialog}
        onDismiss={() => setShowAddDialog(false)}
        style={styles.dialog}
      >
        <Dialog.Title>Add Payment Method</Dialog.Title>
        
        <Dialog.Content>
          <ScrollView showsVerticalScrollIndicator={false}>
            {availablePaymentOptions.map((option) => (
              <Pressable
                key={option.id}
                style={styles.paymentOption}
                onPress={() => handlePaymentOptionSelect(option)}
              >
                <View style={styles.optionHeader}>
                  <View style={[styles.optionIcon, { backgroundColor: option.color }]}>
                    <MaterialIcons 
                      name={option.icon as any} 
                      size={24} 
                      color="white" 
                    />
                  </View>
                  
                  <View style={styles.optionContent}>
                    <Text style={styles.optionName}>{option.name}</Text>
                    <Text style={styles.optionDescription}>{option.description}</Text>
                  </View>
                  
                  <MaterialIcons name="arrow-forward-ios" size={20} color="#999" />
                </View>
                
                {option.requiresVerification && (
                  <View style={styles.verificationNote}>
                    <MaterialIcons name="security" size={16} color="#666" />
                    <Text style={styles.verificationText}>Requires verification</Text>
                  </View>
                )}
              </Pressable>
            ))}
          </ScrollView>
        </Dialog.Content>
        
        <Dialog.Actions>
          <Button onPress={() => setShowAddDialog(false)}>Cancel</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderDeleteDialog = () => (
    <Portal>
      <Dialog
        visible={showDeleteDialog}
        onDismiss={() => {
          setShowDeleteDialog(false);
          setDeletingPaymentMethod(null);
        }}
      >
        <Dialog.Title>Remove Payment Method</Dialog.Title>
        <Dialog.Content>
          <Text>
            Are you sure you want to remove "{deletingPaymentMethod?.displayName}"? 
            This action cannot be undone.
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => {
            setShowDeleteDialog(false);
            setDeletingPaymentMethod(null);
          }}>
            Cancel
          </Button>
          <Button onPress={confirmDeletePaymentMethod} textColor="#F44336">
            Remove
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderPaymentHistoryDialog = () => (
    <Portal>
      <Dialog
        visible={showPaymentHistory}
        onDismiss={() => setShowPaymentHistory(false)}
        style={styles.historyDialog}
      >
        <Dialog.Title>Payment History</Dialog.Title>
        
        <Dialog.Content>
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 400 }}>
            {samplePaymentHistory.map((payment) => (
              <Surface key={payment.id} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyOrderId}>{payment.orderId}</Text>
                  <Chip
                    mode="flat"
                    textStyle={{ color: 'white' }}
                    style={[
                      styles.historyStatusChip,
                      { backgroundColor: getPaymentStatusColor(payment.status) }
                    ]}
                    icon={getPaymentStatusIcon(payment.status)}
                    compact
                  >
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </Chip>
                </View>
                
                <Text style={styles.historyRestaurant}>{payment.restaurant}</Text>
                <Text style={styles.historyAmount}>{formatAmount(payment.amount)}</Text>
                <Text style={styles.historyMethod}>{payment.paymentMethod}</Text>
                <Text style={styles.historyDate}>
                  {formatDate(payment.date)} at {formatTime(payment.date)}
                </Text>
              </Surface>
            ))}
          </ScrollView>
        </Dialog.Content>
        
        <Dialog.Actions>
          <Button onPress={() => setShowPaymentHistory(false)}>Close</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="credit-card-off" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Payment Methods</Text>
      <Text style={styles.emptySubtitle}>
        Add your first payment method to get started
      </Text>
      <Button
        mode="contained"
        onPress={handleAddPaymentMethod}
        icon="add"
        style={styles.addFirstButton}
      >
        Add Payment Method
      </Button>
    </View>
  );

  const renderSecurityMessage = () => (
    <Surface style={styles.securityMessage}>
      <View style={styles.securityHeader}>
        <MaterialIcons name="security" size={24} color="#4CAF50" />
        <Text style={styles.securityTitle}>Secure Payments</Text>
      </View>
      <Text style={styles.securityText}>
        All your payment information is encrypted and secure. 
        We never store your card details on our servers.
      </Text>
    </Surface>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {renderHeader()}
      
      {/* Content */}
      <View style={styles.content}>
        {paymentMethods.length === 0 ? (
          renderEmptyState()
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Security Message */}
            {renderSecurityMessage()}
            
            {/* Payment Methods List */}
            {paymentMethods.map(renderPaymentMethodCard)}
            
            {/* Bottom spacing for FAB */}
            <View style={{ height: 100 }} />
          </ScrollView>
        )}
      </View>
      
      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fabContainer,
          {
            transform: [{
              scale: fabAnim,
            }],
          },
        ]}
      >
        <FAB
          icon="add"
          label="Add Payment"
          onPress={handleAddPaymentMethod}
          style={styles.fab}
          color="white"
        />
      </Animated.View>
      
      {/* Dialogs */}
      {renderAddPaymentDialog()}
      {renderDeleteDialog()}
      {renderPaymentHistoryDialog()}
    </SafeAreaView>
  );
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  
  // Content
  content: {
    flex: 1,
    padding: 16,
  },
  
  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  addFirstButton: {
    marginTop: 20,
    backgroundColor: '#4F46E5',
  },
  
  // FAB
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    zIndex: 10,
  },
  fab: {
    backgroundColor: '#4F46E5',
  },
  
  // Security Message
  securityMessage: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    backgroundColor: '#f8fff8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  securityText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  
  // Payment Card
  paymentCard: {
    marginBottom: 16,
  },
  paymentSurface: {
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  paymentInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  paymentNumber: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 2,
    fontFamily: 'monospace',
  },
  paymentUpi: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  paymentBank: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  paymentCardType: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  paymentExpiry: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  paymentBalance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  paymentActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  verificationChip: {
    alignSelf: 'flex-start',
  },
  defaultChip: {
    backgroundColor: '#4F46E5',
    alignSelf: 'flex-start',
  },
  
  // Divider
  divider: {
    marginHorizontal: 16,
  },
  
  // Payment Footer
  paymentFooter: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  paymentMeta: {
    marginBottom: 12,
  },
  lastUsed: {
    fontSize: 12,
    color: '#999',
  },
  paymentButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  
  // Dialog Styles
  dialog: {
    borderRadius: 12,
  },
  historyDialog: {
    borderRadius: 12,
    maxHeight: height * 0.8,
  },
  
  // Payment Options
  paymentOption: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  verificationNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 52,
  },
  verificationText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  
  // History Items
  historyItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyOrderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  historyStatusChip: {
    alignSelf: 'flex-start',
  },
  historyRestaurant: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  historyAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4F46E5',
    marginBottom: 4,
  },
  historyMethod: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  historyDate: {
    fontSize: 12,
    color: '#999',
  },
}); 