import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import Svg, { G, Path } from "react-native-svg";
import "../global.css";
import { images } from "../constants";

const adviceList = [
  "Que faire si le locataire ne paie pas? - L'état peut se porter caution.",
  "Pensez à souscrire à une assurance habitation pour protéger votre bien.",
  "Faites une vérification régulière de l'état de votre propriété.",
  "Pensez à gardez une trace écrite de toutes les communications avec vos locataires.",
  "Mettez en place un contrat de location clair et détaillé.",
  "Proposez des options de paiement flexibles pour vos locataires.",
  "Effectuez des contrôles de référence avant de louer à de nouveaux locataires.",
  "Envisagez des incitations pour les locataires qui paient leur loyer à temps.",
  "Soyez disponible et réactif aux besoins de vos locataires.",
  "Restez informé des lois et règlements locaux en matière de location."
];

const RandomAdvice = ({ containerStyles, textStyles, isLoading }) => {
  const [advice, setAdvice] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * adviceList.length);
    setAdvice(adviceList[randomIndex]);
  }, []);

  return (
    <View
      className={`rounded-xl min-h-[62px] items-center justify-center ${containerStyles} ${isLoading ? 'opacity-80' : ''}`}
      style={styles.card}
    >
      <Image
        source={images.logo}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text
        style={[styles.adviceText, textStyles]}>
        {advice}
      </Text>
      <View className="bg-primary overflow-hidden h-2/5 rounded-full justify-center">
      </View>
    </View>
  );
}

export default RandomAdvice;

const styles = StyleSheet.create({
  card: {
    height: 100,
    width: "92%",
    backgroundColor: "white",
    borderRadius: 15,
    borderColor:'#000',
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
    marginLeft: '4%',
    flexDirection: 'row',
    position:'absolute',
    alignItems: 'center', // Center vertically
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  adviceText: {
    flex: 1, // Take up remaining space
    textAlign: 'center', // Center text horizontally
    flexShrink: 1, // Prevent text overflow
    fontSize: 14,
    fontFamily:"Poppins-Regular"
  },
  profileImg: {
    width: 30,
    height: 30,
    borderRadius: 50,
    marginRight: 10,
  },
});
