# SFF-Frontend - Algot Holton

---

## Reflektion

Mitt projekt är byggt enligt en metod som jag lärt mig på gymnasiet i kursen webbserverprogrammering. Denna metod fungerar på så sätt att alla delar av webbsidan skapas/genereras på separata ställen. Jag har försökt emulera detta genom att använda mig av moduler och därmed separera så mycket logik som jag kunnat. Detta har även fungerat som ett extra lager abstraktion, då javascript annars behandlar allting som globalt. 

Innan jag började applicera den här metoden försökte jag att ladda in all data direkt från apiet, men jag hade väldigt mycket problem med faktumet att Fetch beter sig asynkront, och därmed inte alltid hann hämta datan innan den behövdes. Detta löste jag genom att ladda in all data från apiet och placera den i sessionStorage. Viss interaktion på sidan orsakar att datan blir hämtad igen, men den uppdateras även var 10:e minut genom en Timeout som sätts varje gång datan blir hämtad. 

En viktig sak för mig var att lösa uppgiften med en SPA - alltså alla delar av sidan byts ut dynamiskt baserat på användarinteraktion istället för att ha dedikerade HTML-filer till dem. Detta skapade visserligen lite problem med att sidan uppdaterades och byttes ut innan datan hade laddats in, och det finns fortfarande lite edge-cases där datan blir sparad efter det att sidan egentligen skulle varit redo att visas. Det skulle visserligen vara någorlunda lätt att förbättra den delen av sidan, men jag känner i skrivande stund inte att jag har varken tiden eller kunskapen nödvändig för att göra detta. 

Avsaknaden av bra CSS märks även väldigt tydligt på sidan. Eftersom det inte fanns krav på styling så planerade jag att göra det sist, som lite puts när sidan var helt klar. Det visade sig däremot att det tog mig mycket längre än väntat att göra klart scriptsen. Detta skyller jag delvis på att jag inte har mycket erfarenhet med javascript och därmed behövde jag ett par dagar för att vänja mig vid en del egenheter i språket. Mitt största problem var däremot att jag inte kände att min kod var särskilt bra inkapslad och det gav mig en hel del problem, innan du lade upp videorna med moduler.

Allt som allt så är jag nöjd med mitt arbete, men jag skulle vilja ha haft mer genomgångar samt förberedelser innan vi började med uppgiften. Eller åtminstone att allt material som skulle vara bra att veta om och använda sig av fanns tillgängligt från början, istället för att det trillade in videor lite allt eftersom. Detta hade gjort att jag behövt mycket mindre tid, samt att jag inte hade behövt göra om allt mitt tidigare arbete för att utnyttja moduler till fullo. Speciellt då majoriteten av materialet går att använda till väldigt bra resultat för uppgiften. 

Jag har inte gått in på något specifikt angående min kod i den här reflektionen, utan jag låter den tala för sig själv. Jag ber om ursäkt redan nu ifall den är svårläst. Jag har inte kommenterat den särskilt noggrant, förutom en kort sammanfattning av vad varje funktion gör. Hoppas att det går att läsa i alla fall :) 