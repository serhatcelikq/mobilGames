import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';
import {auth, database} from '../../../AutoConnect/firebase';
import {
  ref,
  get,
  update,
  push,
  child,
  serverTimestamp,
} from 'firebase/database';

const PaymentMethodsScreen = () => {
  const navigation = useNavigation();
  const {theme} = useTheme();
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [amount, setAmount] = useState('');
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' veya 'withdraw'
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = ref(database, 'users/' + currentUser.uid);

      try {
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserData(data);

          // Bakiye bilgisini al
          setBalance(data.balance || 0);

          // İşlem geçmişini al
          if (data.transactions) {
            // Objeyi diziye çevir ve tarih sırasına göre sırala
            const transactionArray = Object.keys(data.transactions).map(
              key => ({
                id: key,
                ...data.transactions[key],
              }),
            );

            // Tarihe göre sırala (en yeni en üstte)
            transactionArray.sort((a, b) => b.timestamp - a.timestamp);
            setTransactions(transactionArray);
          }
        } else {
          console.log('Kullanıcı verisi bulunamadı!');
        }
      } catch (error) {
        console.error('Veri çekme hatası:', error);
        Alert.alert('Hata', 'Kullanıcı bilgileri yüklenemedi.');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      Alert.alert('Hata', 'Giriş yapmış kullanıcı bulunamadı.');
      navigation.goBack();
    }
  };

  const handleTransaction = async () => {
    // İnput doğrulama
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Uyarı', 'Lütfen geçerli bir miktar girin.');
      return;
    }

    const amountValue = parseFloat(amount);

    // Para çekme işlemi için bakiye kontrolü
    if (activeTab === 'withdraw' && amountValue > balance) {
      Alert.alert(
        'Yetersiz Bakiye',
        'Çekmek istediğiniz miktar bakiyenizden fazla.',
      );
      return;
    }

    setProcessing(true);
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userRef = ref(database, 'users/' + currentUser.uid);
      const transactionsRef = child(userRef, 'transactions');

      try {
        // Yeni bakiyeyi hesapla
        const newBalance =
          activeTab === 'deposit'
            ? balance + amountValue
            : balance - amountValue;

        // İşlem detayları
        const transactionData = {
          amount: amountValue,
          type: activeTab,
          timestamp: Date.now(),
          status: 'completed',
        };

        // Veritabanına yaz
        await push(transactionsRef, transactionData);
        await update(userRef, {
          balance: newBalance,
        });

        // State'leri güncelle
        setBalance(newBalance);
        setTransactions([
          {
            id: Date.now().toString(),
            ...transactionData,
          },
          ...transactions,
        ]);

        // Forma resetle
        setAmount('');

        // Başarılı mesajı göster
        const actionText = activeTab === 'deposit' ? 'yükleme' : 'çekme';
        Alert.alert(
          'İşlem Başarılı',
          `Para ${actionText} işleminiz başarıyla gerçekleştirildi.`,
        );
      } catch (error) {
        console.error('İşlem hatası:', error);
        Alert.alert('Hata', 'İşlem gerçekleştirilemedi.');
      } finally {
        setProcessing(false);
      }
    } else {
      setProcessing(false);
      Alert.alert('Hata', 'Giriş yapmış kullanıcı bulunamadı.');
    }
  };

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accentColor} />
          <Text style={{color: theme.textColor, marginTop: 10}}>
            Bilgiler yükleniyor...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      <View style={[styles.header, {backgroundColor: theme.headerColor}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={[styles.backButtonText, {color: theme.textColor}]}>
            ←
          </Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.textColor}]}>
          Cüzdan
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* Bakiye Kartı */}
        <View
          style={[styles.balanceCard, {backgroundColor: theme.accentColor}]}>
          <Text style={styles.balanceLabel}>Güncel Bakiyeniz</Text>
          <Text style={styles.balanceAmount}>
            {balance.toLocaleString('tr-TR')} ₺
          </Text>
        </View>

        {/* Tab Seçicisi */}
        <View style={[styles.tabContainer, {backgroundColor: theme.cardColor}]}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'deposit' && [
                styles.activeTab,
                {borderColor: theme.accentColor},
              ],
            ]}
            onPress={() => setActiveTab('deposit')}>
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'deposit'
                      ? theme.accentColor
                      : theme.secondaryTextColor,
                },
              ]}>
              Para Yükle
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'withdraw' && [
                styles.activeTab,
                {borderColor: theme.accentColor},
              ],
            ]}
            onPress={() => setActiveTab('withdraw')}>
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'withdraw'
                      ? theme.accentColor
                      : theme.secondaryTextColor,
                },
              ]}>
              Para Çek
            </Text>
          </TouchableOpacity>
        </View>

        {/* İşlem Formu */}
        <View style={[styles.formCard, {backgroundColor: theme.cardColor}]}>
          <Text style={[styles.formLabel, {color: theme.textColor}]}>
            {activeTab === 'deposit' ? 'Yüklenecek Miktar' : 'Çekilecek Miktar'}
          </Text>
          <View
            style={[styles.inputContainer, {borderColor: theme.borderColor}]}>
            <TextInput
              style={[styles.input, {color: theme.textColor}]}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor={theme.secondaryTextColor}
              keyboardType="numeric"
            />
            <Text
              style={[
                styles.currencySymbol,
                {color: theme.secondaryTextColor},
              ]}>
              ₺
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, {backgroundColor: theme.accentColor}]}
            onPress={handleTransaction}
            disabled={processing}>
            {processing ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {activeTab === 'deposit' ? 'Para Yükle' : 'Para Çek'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* İşlem Geçmişi */}
        <View style={styles.transactionsContainer}>
          <Text style={[styles.sectionTitle, {color: theme.textColor}]}>
            İşlem Geçmişi
          </Text>

          {transactions.length > 0 ? (
            <ScrollView
              style={styles.transactionsList}
              nestedScrollEnabled={true}>
              {transactions.map(item => (
                <View
                  key={item.id}
                  style={[
                    styles.transactionItem,
                    {backgroundColor: theme.cardColor},
                  ]}>
                  <View style={styles.transactionLeft}>
                    <Text
                      style={[
                        styles.transactionType,
                        {color: theme.textColor},
                      ]}>
                      {item.type === 'deposit'
                        ? '💵 Para Yükleme'
                        : '💸 Para Çekme'}
                    </Text>
                    <Text
                      style={[
                        styles.transactionDate,
                        {color: theme.secondaryTextColor},
                      ]}>
                      {formatDate(item.timestamp)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {color: item.type === 'deposit' ? '#4CAF50' : '#F44336'},
                    ]}>
                    {item.type === 'deposit' ? '+' : '-'}
                    {item.amount.toLocaleString('tr-TR')} ₺
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View
              style={[styles.emptyState, {backgroundColor: theme.cardColor}]}>
              <Text
                style={[
                  styles.emptyStateText,
                  {color: theme.secondaryTextColor},
                ]}>
                Henüz işlem geçmişiniz bulunmamaktadır.
              </Text>
            </View>
          )}
        </View>

        {/* Bilgilendirme */}
        <View style={styles.infoSection}>
          <Text style={[styles.infoText, {color: theme.secondaryTextColor}]}>
            Para yükleme işlemleri anında gerçekleşir. Para çekme işlemleri ise
            1-3 iş günü içerisinde hesabınıza yansır.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  balanceCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  formCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 1,
  },
  formLabel: {
    fontSize: 16,
    marginBottom: 12,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 18,
    fontWeight: '500',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '500',
  },
  submitButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  transactionsList: {
    marginBottom: 10,
    maxHeight: 300,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionType: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 13,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyStateText: {
    textAlign: 'center',
    fontSize: 14,
  },
  infoSection: {
    marginBottom: 30,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PaymentMethodsScreen;
