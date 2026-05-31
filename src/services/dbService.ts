/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CycleLog, User, UserProfile, AIChatSession } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export const dbService = {
  async saveUser(user: User, profile: UserProfile) {
    const path = `users/${user.id}`;
    try {
      const existing = await this.getUser(user.id);
      const data: any = {
        ...user,
        ...profile,
        updatedAt: serverTimestamp()
      };
      
      if (!existing) {
        data.createdAt = serverTimestamp();
      }
      
      await setDoc(doc(db, path), data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async getUser(userId: string) {
    const path = `users/${userId}`;
    try {
      const snap = await getDoc(doc(db, path));
      return snap.exists() ? snap.data() : null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
    }
  },

  async saveLog(userId: string, log: CycleLog) {
    const path = `users/${userId}/logs/${log.id}`;
    try {
      const logDoc = await getDoc(doc(db, path));
      const data: any = {
        ...log,
        updatedAt: serverTimestamp()
      };
      
      if (!logDoc.exists()) {
        data.createdAt = serverTimestamp();
      }
      
      await setDoc(doc(db, path), data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  async deleteLog(userId: string, logId: string) {
    const path = `users/${userId}/logs/${logId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async saveAIChat(userId: string, session: Partial<AIChatSession> & { id: string }) {
    const path = `users/${userId}/chats/${session.id}`;
    try {
      const chatDoc = await getDoc(doc(db, path));
      const data: any = {
        ...session,
        updatedAt: serverTimestamp()
      };
      
      if (!chatDoc.exists()) {
        data.createdAt = serverTimestamp();
      }
      
      await setDoc(doc(db, path), data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  subscribeToAIChats(userId: string, callback: (chats: AIChatSession[]) => void) {
    const path = `users/${userId}/chats`;
    const q = query(collection(db, path), orderBy('updatedAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const chats = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as AIChatSession));
      callback(chats);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  },

  async deleteAIChat(userId: string, chatId: string) {
    const path = `users/${userId}/chats/${chatId}`;
    try {
      await deleteDoc(doc(db, path));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  subscribeToLogs(userId: string, callback: (logs: CycleLog[]) => void) {
    const path = `users/${userId}/logs`;
    const q = query(collection(db, path), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => doc.data() as CycleLog);
      callback(logs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });
  }
};
