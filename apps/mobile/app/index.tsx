import { theme } from "../../../packages/ui/native/theme";

import { Link, router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";

export default function SignIn() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  function onSignIn(){ if(email && password){ router.push("/dashboard"); } }
  return (
    <View style={s.container}>
      <View style={s.card}>
        <Text style={s.title}>Se connecter</Text>
        <Text style={s.label}>Adresse e-mail</Text>
        <TextInput style={s.input} autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Text style={s.label}>Mot de passe</Text>
        <TextInput style={s.input} secureTextEntry value={password} onChangeText={setPassword} />
        <Pressable style={s.btn} onPress={onSignIn}><Text style={s.btnText}>Connexion</Text></Pressable>
        <Link href="/forgot" style={s.link}>Mot de passe oublié ?</Link>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container:{ flex:1, alignItems:"center", justifyContent:"center", backgroundColor: theme.bg },
  card:{ width:"88%", backgroundColor: theme.panel, borderRadius:16, padding:20, ...theme.shadow },
  title:{ fontSize:24, fontWeight:"700", marginBottom:12 },
  label:{ color:"#6b7280", marginTop:8 },
  input:{ borderWidth:1, borderColor:"#e5e7eb", borderRadius:12, padding:10, marginTop:4 },
  btn:{ backgroundColor: theme.brand, padding:12, borderRadius:12, alignItems:"center", marginTop:12 },
  btnText:{ color:"#fff", fontWeight:"600" },
  link:{ color: theme.brand, textAlign:"center", marginTop:10 }
});
