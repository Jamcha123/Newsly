import * as functions from 'firebase-functions'
import admin from 'firebase-admin'

admin.initializeApp()

export const free_api = functions.https.onRequest({cors: true}, async (req, res) => {

})

export const basic_api = functions.https.onRequest({cors: true}, async (req, res) => {

})

export const pro_api = functions.https.onRequest({cors: true}, async (req, res) => {
    
})