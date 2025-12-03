import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EVENT_IMAGES: { [key: string]: any } = {
  dummy_event_1: require('../assets/events/dummy_event_1.jpg'),
  dummy_event_2: require('../assets/events/dummy_event_2.jpg'),
  dummy_event_3: require('../assets/events/dummy_event_3.jpg'),
  dummy_event_4: require('../assets/events/dummy_event_4.jpg'),
  dummy_event_5: require('../assets/events/dummy_event_5.jpg'),
  dummy_event_6: require('../assets/events/dummy_event_6.jpg'),
  dummy_event_7: require('../assets/events/dummy_event_7.jpg'),
  dummy_event_8: require('../assets/events/dummy_event_8.jpg'),
  dummy_event_9: require('../assets/events/dummy_event_9.jpg'),
  dummy_event_10: require('../assets/events/dummy_event_10.jpg'),
  dummy_event_11: require('../assets/events/dummy_event_11.jpg'),
  dummy_event_12: require('../assets/events/dummy_event_12.jpg'),
};

interface Event {
  id: string;
  title: string;
  photo: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  tags: string;
}

interface EventDetailProps {
  event: Event;
  onBack: () => void;
}

export default function EventDetail({ event, onBack }: EventDetailProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FCBF27" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <Image source={EVENT_IMAGES[event.photo]} style={styles.photo} resizeMode="cover" />

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{event.title}</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#FCBF27" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Time</Text>
                <Text style={styles.infoValue}>
                  {formatTime(event.start_time)} - {formatTime(event.end_time)}
                </Text>
                <Text style={styles.infoSubtext}>
                  {formatDateTime(event.start_time).split(',')[0]}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#FCBF27" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{event.location}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="document-text-outline" size={20} color="#FCBF27" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Description</Text>
                <Text style={styles.description}>{event.description}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Ionicons name="pricetag-outline" size={20} color="#FCBF27" />
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {event.tags.split(',').map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag.trim()}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FCBF27',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-BoldItalic',
    color: '#FCBF27',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  photo: {
    width: '100%',
    height: 250,
    backgroundColor: '#1a1a1a',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Poppins-BoldItalic',
    color: '#FCBF27',
    marginBottom: 20,
  },
  infoSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCBF27',
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.7,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'Poppins-BoldItalic',
    color: '#FCBF27',
  },
  infoSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    opacity: 0.8,
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FCBF27',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#FCBF27',
    opacity: 0.3,
    marginVertical: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#FCBF27',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#121212',
    fontWeight: '600',
  },
});
