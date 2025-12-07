import { collection, doc, setDoc } from "firebase/firestore";
// import restaurants from "../store/restaurants";
import { db } from "./firebaseConfig";
// const restaurantCollection = restaurants;

import { slots } from "../store/restaurants";

// const uploadData = async () => {
//     try {
//         for (let i = 0; i < restaurantCollection.length; i++) {
//             const restaurant = restaurantCollection[i];
//             const docRef = doc(collection(db, "restaurants"), `restaurant_${i + 1}`);
//             await setDoc(docRef, restaurant);
//         }
//         console.log("Data uploaded");
//     } catch (error) {
//         console.log("Error uploading data:", error);
//     }
// }
// export default uploadData;

const restaurantData = slots;

const uploadData = async () => {
    try {
        for (let i = 0; i < restaurantData.length; i++) {
            const restaurant = restaurantData[i];
            const docRef = doc(collection(db, "slots"), `slots_${i + 1}`);
            await setDoc(docRef, restaurant);
        }
        console.log("Data Upload Successfully");
    }catch (e) {
        console.log("Error uploading data:", e);
    }
}
export default uploadData;