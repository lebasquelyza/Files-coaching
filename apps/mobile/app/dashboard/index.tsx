import { theme } from "../../../../packages/ui/native/theme";

import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable } from "react-native";

export default function Dashboard() {
  const exercises = [
    { title: "Respiration 4-4-4", desc: "Inspirez 4s, bloquez 4s, expirez 4s (5 reps)" },
    { title: "Squats lents", desc: "3 × 10 répétitions contrôlées" },
    { title: "Planche", desc: "2 × 30 secondes" },
  ];
  const [bmi, setBmi] = useState({ size:"170", weight:"70" });
  const h = parseFloat(bmi.size)/100; const w = parseFloat(bmi.weight); const val = h>0&&w>0?(w/(h*h)):0; const r = Math.round(val*10)/10;
  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.h1}>Bienvenue 👋</Text>
      <View style={s.card}>
        <Text style={s.h2}>Exercices simples</Text>
        {exercises.map((e,i)=> (
          <View key={i} style={s.item}>
            <Text style={s.itemTitle}>{e.title}</Text>
            <Text style={s.itemDesc}>{e.desc}</Text>
          </View>
        ))}
      </View>
      <View style={s.card}>
        <Text style={s.h2}>IMC rapide</Text>
        <View style={{ flexDirection:"row", gap:8 }}>
          <View style={{ flex:1 }}>
            <Text style={s.label}>Taille (cm)</Text>
            <TextInput style={s.input} keyboardType="numeric" value={bmi.size} onChangeText={t=>setBmi(v=>({...v, size:t}))} />
          </View>
          <View style={{ flex:1 }}>
            <Text style={s.label}>Poids (kg)</Text>
            <TextInput style={s.input} keyboardType="numeric" value={bmi.weight} onChangeText={t=>setBmi(v=>({...v, weight:t}))} />
          </View>
        </View>
        <Text style={s.big}>{isFinite(r)? r : "-"} IMC</Text>
      </View>
      <Pressable style={s.btn}><Text style={s.btnText}>Aller aux recettes</Text></Pressable>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:{ padding:16, backgroundColor: theme.bg },
  h1:{ fontSize:22, fontWeight:"700", marginBottom:12 },
  h2:{ fontSize:18, fontWeight:"600", marginBottom:8 },
  card:{ backgroundColor: theme.panel, borderRadius:16, padding:16, marginBottom:12, ...theme.shadow },
  item:{ borderWidth:1, borderColor:"#e5e7eb", borderRadius:12, padding:12, marginBottom:8 },
  itemTitle:{ fontWeight:"600" },
  itemDesc:{ color:"#6b7280" },
  label:{ color:"#6b7280", marginTop:6 },
  input:{ borderWidth:1, borderColor:"#e5e7eb", borderRadius:12, padding:10, marginTop:4 },
  big:{ fontSize:28, fontWeight:"700", marginTop:8 },
  btn:{ backgroundColor: theme.brand, padding:12, borderRadius:12, alignItems:"center", marginTop:8 },
  btnText:{ color:"#fff", fontWeight:"600" }
});
