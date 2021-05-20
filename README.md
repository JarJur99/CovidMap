# CovidMap
Projekt studencki, mapa pokazująca liczbę zakażeń covid19 w poszczególnych krajach, pozwalająca na wykreślenie wykresów dla wybranego kraju z wybranego okresu
Projek napisany w języku c# opiera się na platformie Blazor, główna część projektu napisana w JavaScripcie,
W projekcie wykorzystane zostały wykresy js am4charts oraz covidowe api w darmowej wersji dostępne na stronie: https://covid19api.com/
Po włączeniu projektu należy wcisnąć przycisk Generate Map do zainicjalizowania mapy. Gdy mapa jest już gotowa można wybrać okres z którego pobierane są dane
i po kliknięciu w wybrany kraj rysowany jest wykres ze statystykami z wybranego okresu. Główna część kodu w /wwwroot/js/chart.js
