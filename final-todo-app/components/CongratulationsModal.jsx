import React from 'react';
import { Modal, View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function CongratulationsModal({ visible, onClose }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Ionicons name="trophy" size={60} color="#FFD700" />
          <Text style={styles.modalTitle}>축하합니다! 🎉</Text>
          <Text style={styles.modalText}>이번 달 목표를 모두 달성했어요!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>계속하기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginVertical: 15,
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1E90FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});