import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import { useAddressStore } from '../../store/addressStore';

export function useAddresses(isSelectionMode: boolean = false) {
  const router = useRouter();
  const { addresses, deleteAddress, setDefaultAddress, setManuallySelectedAddress } = useAddressStore();

  const handleAddAddress = () => {
    if (isSelectionMode) {
      router.push('/profile/addEditAddress?selectionMode=true');
    } else {
      router.push('/profile/addEditAddress');
    }
  };

  const handleEditAddress = (address: any) => {
    router.push({
      pathname: '/profile/addEditAddress',
      params: { addressId: address.address_id, mode: 'edit' }
    });
  };

  const handleDeleteAddress = (address: any) => {
    Alert.alert(
      'Delete Address',
      `Are you sure you want to delete "${address.full_name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteAddress(address.address_id);
          }
        },
      ]
    );
  };

  const handleSetDefault = (address: any) => {
    setDefaultAddress(address.address_id);
  };

  const handleSelectAddress = (address: any) => {
    setManuallySelectedAddress(address);
    // Navigate back to cart screen
    router.back();
  };

  const handleHelpPress = () => {
    Alert.alert('Help', 'Address management help coming soon!');
  };

  return {
    addresses,
    handleAddAddress,
    handleEditAddress,
    handleDeleteAddress,
    handleSetDefault,
    handleSelectAddress,
    handleHelpPress,
  };
}
