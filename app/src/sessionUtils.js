import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkUserSession = async () => {
  try {
    const userSession = await AsyncStorage.getItem('userSession');
    if (!userSession) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};

export const fetchUsername = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user || null;
  } catch (error) {
    console.error('Error fetching username:', error);
    return null;
  }
};

export const clearSession = async () => {
  try {
    await AsyncStorage.removeItem('userSession');
  } catch (error) {
    console.error('Error clearing session:', error);
  }
};
