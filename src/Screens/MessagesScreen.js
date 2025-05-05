import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useTheme} from '../context/ThemeContext';

// Örnek kullanıcılar ve konuşmalar
const sampleConversations = [
  {
    id: '1',
    name: 'Ahmet Satıcı',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    car: {
      id: '1',
      make: 'Toyota',
      model: 'Corolla',
      year: 2019,
      price: '225.000 TL',
      image:
        'https://images.unsplash.com/photo-1626072778346-0ab6604d39c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    },
    lastMessage: 'Aracın km bilgisini öğrenebilir miyim?',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 saat önce
    unread: 2,
  },
  {
    id: '2',
    name: 'Mehmet Galeri',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    car: {
      id: '3',
      make: 'Volkswagen',
      model: 'Passat',
      year: 2020,
      price: '375.000 TL',
      image:
        'https://images.unsplash.com/photo-1632038229229-06c76eba7982?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    },
    lastMessage: 'İyi günler, satış fiyatında pazarlık payı var mı?',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 gün önce
    unread: 0,
  },
  {
    id: '3',
    name: 'Ayşe Motors',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    car: {
      id: '5',
      make: 'BMW',
      model: 'X5',
      year: 2021,
      price: '750.000 TL',
      image:
        'https://images.unsplash.com/photo-1520031441872-265e4ff70366?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
    },
    lastMessage: 'Hafta sonu test sürüşü için müsait misiniz?',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 gün önce
    unread: 1,
  },
];

// Her kullanıcı için örnek mesajlaşma geçmişi
const sampleMessageHistory = {
  1: [
    {
      id: '101',
      text: 'Merhaba, Toyota Corolla aracınız hakkında bilgi almak istiyorum.',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 saat önce
      isMine: true,
    },
    {
      id: '102',
      text: 'Merhaba, tabii ki. Size nasıl yardımcı olabilirim?',
      timestamp: new Date(Date.now() - 7000000).toISOString(),
      isMine: false,
      sender: 'Ahmet Satıcı',
    },
    {
      id: '103',
      text: 'Aracın güncel kilometre durumu nedir?',
      timestamp: new Date(Date.now() - 6800000).toISOString(),
      isMine: true,
    },
    {
      id: '104',
      text: 'Araç şu anda 45.000 kilometrede ve tüm bakımları yetkili serviste yapıldı.',
      timestamp: new Date(Date.now() - 6600000).toISOString(),
      isMine: false,
      sender: 'Ahmet Satıcı',
    },
    {
      id: '105',
      text: 'Aracın km bilgisini öğrenebilir miyim?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isMine: true,
    },
  ],
  2: [
    {
      id: '201',
      text: 'Merhaba, Volkswagen Passat aracınızla ilgileniyorum.',
      timestamp: new Date(Date.now() - 93600000).toISOString(),
      isMine: true,
    },
    {
      id: '202',
      text: 'Merhaba, hoş geldiniz. Aracımız 2020 model ve çok temiz durumda.',
      timestamp: new Date(Date.now() - 93400000).toISOString(),
      isMine: false,
      sender: 'Mehmet Galeri',
    },
    {
      id: '203',
      text: 'İyi günler, satış fiyatında pazarlık payı var mı?',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isMine: true,
    },
  ],
  3: [
    {
      id: '301',
      text: 'Merhaba, BMW X5 aracınızı inceledim ve çok beğendim.',
      timestamp: new Date(Date.now() - 180000000).toISOString(),
      isMine: true,
    },
    {
      id: '302',
      text: 'Merhaba, teşekkür ederim. Aracımız 2021 model ve full donanımlı.',
      timestamp: new Date(Date.now() - 179800000).toISOString(),
      isMine: false,
      sender: 'Ayşe Motors',
    },
    {
      id: '303',
      text: 'Test sürüşü yapabilir miyim?',
      timestamp: new Date(Date.now() - 179600000).toISOString(),
      isMine: true,
    },
    {
      id: '304',
      text: 'Tabii ki, istediğiniz zaman showroomumuza gelebilirsiniz.',
      timestamp: new Date(Date.now() - 179400000).toISOString(),
      isMine: false,
      sender: 'Ayşe Motors',
    },
    {
      id: '305',
      text: 'Hafta sonu test sürüşü için müsait misiniz?',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      isMine: true,
    },
    {
      id: '306',
      text: 'Evet, cumartesi 10:00-18:00 arası müsaitiz.',
      timestamp: new Date(Date.now() - 172600000).toISOString(),
      isMine: false,
      sender: 'Ayşe Motors',
    },
  ],
};

export default function MessagesScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {theme} = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [conversationList, setConversationList] = useState(sampleConversations);
  const flatListRef = useRef(null);

  // Route'dan gelen araba ve kişi bilgileri
  const contactId = route.params?.contactId;
  const car = route.params?.car;

  // Route ile bir araç veya kişi geldiğinde konuşmayı başlat
  useEffect(() => {
    if (car && contactId) {
      // Eğer mevcut konuşma varsa onu göster
      const existingConversation = conversationList.find(
        c => c.id === contactId,
      );

      if (existingConversation) {
        handleConversationSelect(existingConversation);
      } else {
        // Yeni konuşma oluştur
        const newConversation = {
          id: contactId,
          name: 'Yeni Satıcı',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          car: car,
          lastMessage: '',
          timestamp: new Date().toISOString(),
          unread: 0,
        };

        setConversationList(prev => [newConversation, ...prev]);
        handleConversationSelect(newConversation);
      }
    }
  }, [car, contactId]);

  // Mesajlar değiştiğinde otomatik kaydırma
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({animated: true});
      }, 100);
    }
  }, [messages]);

  // Konuşma seçildiğinde mesajları yükle
  const handleConversationSelect = conversation => {
    setActiveConversation(conversation);

    // Örnek mesaj geçmişi var mı kontrol et
    const messageHistory = sampleMessageHistory[conversation.id] || [];

    // Eğer mesaj geçmişi yoksa, otomatik bir hoşgeldin mesajı oluştur
    if (messageHistory.length === 0) {
      const initialMessages = [
        {
          id: '1',
          text: `Merhaba, ${conversation.car.make} ${conversation.car.model} aracı ile ilgili bilgi almak istiyorum.`,
          timestamp: new Date().toISOString(),
          isMine: true,
        },
        {
          id: '2',
          text: 'Merhaba, aracımız hakkında hangi konuda bilgi almak istersiniz?',
          timestamp: new Date(Date.now() + 1000).toISOString(),
          isMine: false,
          sender: conversation.name,
        },
      ];
      setMessages(initialMessages);
    } else {
      setMessages(messageHistory);
    }

    // Okunmamış mesajları okundu olarak işaretle
    if (conversation.unread > 0) {
      const updatedConversations = conversationList.map(c => {
        if (c.id === conversation.id) {
          return {...c, unread: 0};
        }
        return c;
      });
      setConversationList(updatedConversations);
    }
  };

  // Konuşma listesine dön
  const handleBackToList = () => {
    setActiveConversation(null);
  };

  // Mesaj gönder
  const sendMessage = () => {
    if (message.trim() === '' || !activeConversation) return;

    const newMessage = {
      id: String(new Date().getTime()),
      text: message,
      timestamp: new Date().toISOString(),
      isMine: true,
    };

    // Mesajlar listesini güncelle
    setMessages(prevMessages => [...prevMessages, newMessage]);

    // Konuşma listesinde son mesajı güncelle
    const updatedConversations = conversationList.map(c => {
      if (c.id === activeConversation.id) {
        return {
          ...c,
          lastMessage: message,
          timestamp: new Date().toISOString(),
        };
      }
      return c;
    });

    // Konuşma listesini sırala (en son mesaj en üstte)
    updatedConversations.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
    );

    setConversationList(updatedConversations);
    setMessage('');

    // Satıcıdan otomatik yanıt (gerçek uygulamada Firebase'den gelecektir)
    setTimeout(() => {
      const response = {
        id: String(new Date().getTime() + 1),
        text: 'Teşekkürler, en kısa sürede size yardımcı olacağım.',
        timestamp: new Date().toISOString(),
        isMine: false,
        sender: activeConversation.name,
      };

      // Mesajlar listesini güncelle
      setMessages(prevMessages => [...prevMessages, response]);

      // Konuşma listesinde son mesajı güncelle
      const updatedWithResponse = conversationList.map(c => {
        if (c.id === activeConversation.id) {
          return {
            ...c,
            lastMessage: response.text,
            timestamp: response.timestamp,
          };
        }
        return c;
      });

      // Konuşma listesini sırala
      updatedWithResponse.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      );

      setConversationList(updatedWithResponse);
    }, 1000);
  };

  // Zaman formatını düzenle
  const formatTime = timestamp => {
    const messageDate = new Date(timestamp);
    const now = new Date();

    // Aynı gün içinde
    if (messageDate.toDateString() === now.toDateString()) {
      return `${messageDate.getHours()}:${messageDate
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;
    }

    // Dün
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Dün';
    }

    // 1 hafta içinde
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (messageDate > oneWeekAgo) {
      const days = [
        'Pazar',
        'Pazartesi',
        'Salı',
        'Çarşamba',
        'Perşembe',
        'Cuma',
        'Cumartesi',
      ];
      return days[messageDate.getDay()];
    }

    // Daha eski
    return `${messageDate.getDate()}/${
      messageDate.getMonth() + 1
    }/${messageDate.getFullYear()}`;
  };

  // Mesaj öğesi render etme
  const renderMessageItem = ({item}) => (
    <View
      style={[
        styles.messageContainer,
        item.isMine ? styles.myMessage : styles.otherMessage,
        {
          backgroundColor: item.isMine
            ? theme.accentColor + '20'
            : theme.cardColor,
        },
      ]}>
      {!item.isMine && (
        <Text style={[styles.senderName, {color: theme.accentColor}]}>
          {item.sender}
        </Text>
      )}
      <Text style={[styles.messageText, {color: theme.textColor}]}>
        {item.text}
      </Text>
      <Text style={[styles.timestamp, {color: theme.secondaryTextColor}]}>
        {formatTime(item.timestamp)}
      </Text>
    </View>
  );

  // Konuşma öğesi render etme
  const renderConversationItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.conversationItem,
        {
          backgroundColor: theme.cardColor,
          borderColor: theme.borderColor,
        },
      ]}
      onPress={() => handleConversationSelect(item)}>
      <Image
        source={{uri: item.avatar}}
        style={styles.conversationAvatar}
        resizeMode="cover"
      />
      {item.unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>{item.unread}</Text>
        </View>
      )}
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text
            style={[
              styles.conversationName,
              {color: theme.textColor},
              item.unread > 0 && styles.unreadText,
            ]}
            numberOfLines={1}>
            {item.name}
          </Text>
          <Text
            style={[
              styles.conversationTime,
              {color: theme.secondaryTextColor},
            ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
        <View style={styles.conversationSubheader}>
          <Text
            style={[
              styles.conversationLastMessage,
              {color: theme.secondaryTextColor},
              item.unread > 0 && styles.unreadText,
            ]}
            numberOfLines={1}>
            {item.lastMessage}
          </Text>
          <Text
            style={[
              styles.conversationCarInfo,
              {color: theme.secondaryTextColor},
            ]}>
            {`${item.car.make} ${item.car.model}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Mesajlaşma ekranını render et
  const renderChatScreen = () => (
    <>
      <View style={[styles.header, {backgroundColor: theme.headerColor}]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackToList}>
          <Text style={[styles.backButtonText, {color: theme.textColor}]}>
            ←
          </Text>
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={[styles.headerText, {color: theme.textColor}]}>
            {activeConversation?.name || 'Mesajlar'}
          </Text>
          <Text
            style={[styles.subHeaderText, {color: theme.secondaryTextColor}]}>
            {activeConversation
              ? `${activeConversation.car.make} ${activeConversation.car.model}`
              : ''}
          </Text>
        </View>

        {activeConversation && (
          <Image
            source={{uri: activeConversation.avatar}}
            style={styles.carImage}
            resizeMode="cover"
          />
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
        onContentSizeChange={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({animated: true});
          }
        }}
        onLayout={() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToEnd({animated: true});
          }
        }}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      />

      <View style={[styles.inputContainer, {backgroundColor: theme.cardColor}]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.backgroundColor,
              color: theme.textColor,
              borderColor: theme.borderColor,
            },
          ]}
          placeholder="Mesajınızı yazın..."
          placeholderTextColor={theme.secondaryTextColor}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor:
                message.trim() === ''
                  ? theme.buttonColor + '80'
                  : theme.accentColor,
            },
          ]}
          onPress={sendMessage}
          disabled={message.trim() === ''}>
          <Text style={styles.sendButtonText}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // Konuşma listesi ekranını render et
  const renderConversationListScreen = () => (
    <>
      <View style={[styles.header, {backgroundColor: theme.headerColor}]}>
        <Text style={[styles.headerTitle, {color: theme.accentColor}]}>
          Mesajlarım
        </Text>
      </View>

      {conversationList.length > 0 ? (
        <FlatList
          data={conversationList}
          renderItem={renderConversationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.conversationsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, {color: theme.textColor}]}>
            Henüz mesaj bulunmuyor
          </Text>
          <Text
            style={[styles.emptySubtext, {color: theme.secondaryTextColor}]}>
            İlgilendiğiniz araçlar için satıcılarla iletişime geçin
          </Text>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
      {activeConversation ? renderChatScreen() : renderConversationListScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subHeaderText: {
    fontSize: 14,
  },
  carImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  // Mesajlaşma ekranı stilleri
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  myMessage: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    minHeight: 40,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  // Konuşma listesi stilleri
  conversationsList: {
    padding: 8,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 4,
    borderRadius: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  conversationAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  conversationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationSubheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  conversationTime: {
    fontSize: 12,
    marginLeft: 8,
  },
  conversationLastMessage: {
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  conversationCarInfo: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  unreadBadge: {
    position: 'absolute',
    top: 12,
    left: 40,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  unreadText: {
    fontWeight: 'bold',
    color: '#000',
  },

  // Boş liste ekranı stilleri
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 250,
  },
});
