import { useState, useEffect } from 'react';
import './App.css';

function Przepis({tytul , skladniki , kroki , czas , children}) { 
  return (
    <div className='karta'>
      <h2>{tytul}</h2><span>{czas}</span>
      <p>Składniki:</p>
      <ul>
        {skladniki.map((skladnik, index) => (
          <li key={index}>{skladnik}</li>
        ))}
      </ul>
      <p>{kroki}</p>
      <div>
        {children}
      </div>
    </div>
  );
}
const dostepneSkladniki = ["pomidor","pomarańcza","woda w proszku"]
function App() {
  const [tytul, setTytul] = useState('');
  const [skladniki, setSkladniki] = useState([]);
  const [kroki, setKroki] = useState('');
  const [czas, setCzas] = useState('');
  const [przepisy, setPrzepisy] = useState([]);
  const [sort,SetSort] = useState(false)

  // This is for keeping track of nextId
  const [nextId, setNextId] = useState(0);

  // Read data from localStorage and set nextId
  useEffect(() => {
    const tmp = JSON.parse(localStorage.getItem('przepis'));
    if (tmp && tmp.length > 0) {
      setNextId(tmp[tmp.length - 1].id + 1);  // Increment to get the next id
      setPrzepisy(tmp);
    }
  }, []);

  // Save przepisy to localStorage every time they change
  useEffect(() => {
    localStorage.setItem('przepis', JSON.stringify(przepisy));
  }, [przepisy]);

  function addSkladnik() {
    if (!skladniki.includes(selectedSkladnik)) {
      setSkladniki([...skladniki, selectedSkladnik]);
    } else {
      alert('Ten składnik już istnieje!');
    }
  }

  function dane() {
    const nowy = { id: nextId, tytul, skladniki , kroki , czas , ulubione:false};
    console.log(nowy)
    setPrzepisy([...przepisy, nowy]);
    setNextId(nextId + 1); // Update nextId after adding a new recipe
  }
  function usun(id){
    let tmp = [];
    for (let i = 0; i < przepisy.length; i++) {
      if (przepisy[i].id != id) {
        tmp.push(przepisy[i])
      }
    }
    setPrzepisy(tmp)
  } 
  const [edytowany,SetEdytowany] = useState() 
  function edytuj(id) {
    // Find the recipe being edited by id
    const recipeToEdit = przepisy.find(p => p.id === id);
    if (recipeToEdit) {
      SetEdytowany(recipeToEdit);
    }
  }
  
  function edytujIngredients() {
    // Add selected ingredient to the edited recipe's ingredients list
    if (!skladniki.includes(selectedSkladnik)) {
      // Add the ingredient if it's not already in the list
      setSkladniki([...skladniki, selectedSkladnik]);
      SetEdytowany({ ...edytowany, skladniki: [...skladniki, selectedSkladnik] });
    } else {
      alert('Ten składnik już istnieje!');
    }
  }
  
  function removeSkladnik(ingredientToRemove) {
    // Remove ingredient from the edited recipe's ingredients list
    if (edytowany) {
      const updatedSkladniki = edytowany.skladniki.filter(skladnik => skladnik !== ingredientToRemove);
      SetEdytowany({ ...edytowany, skladniki: updatedSkladniki });
    }
  }
  
  function edycjaDanych(){
    let tytul = edytowany.tytul;
    let skladniki = edytowany.skladniki;
    let kroki = edytowany.kroki;
    let czas = edytowany.czas;

    let tab=[];
    let nowy
    for(let i=0;i<przepisy.length;i++){
      if(edytowany.id == przepisy[i].id){
        nowy = { id: edytowany.id, tytul: edytowany.tytul, skladniki: edytowany.skladniki , kroki: edytowany.kroki , czas: edytowany.czas};
        tab.push(nowy)
      }else{
        tab.push(przepisy[i])
      }
    }
    console.log(tab)
    setPrzepisy(tab)
    SetEdytowany(null)
    setSkladniki([])

}
function polub(id) {
  let tab = [];
  for (let i = 0; i < przepisy.length; i++) {
    if (id === przepisy[i].id) {
      const nowy = { ...przepisy[i], ulubione: !przepisy[i].ulubione };
      tab.push(nowy);
    } else {
      tab.push(przepisy[i]);
    }
  }
  setPrzepisy(tab);
}
const [szukane,setSzukane] = useState('')
function tablica(){
  if (!szukane) return przepisy;

  return przepisy.filter(p =>
    p.skladniki.includes(szukane)
  );
}
const [selectedSkladnik, setSelectedSkladnik] = useState(dostepneSkladniki[0]);
const [czyUlubione, ustawUlubione] = useState(false);
  if(czyUlubione){
    return(
      <div>
        <button onClick={()=>{ustawUlubione(false)}}>wszystkie</button>
        <h1>ulubione przepisy</h1>
        {
        przepisy.filter(p => p.ulubione).map((p) => (
          <Przepis 
            key={p.id}
            tytul={p.tytul}
            skladniki={p.skladniki}
            kroki={p.kroki}
            czas={p.czas}
          >
      <button onClick={() => {usun(p.id)}}>usuń</button>
      <button onClick={() => {edytuj(p.id)}}>edytuj</button>
      <input 
        type='checkbox' 
        onChange={() => { polub(p.id); }} 
        checked={p.ulubione} 
      />
    </Przepis>
  ))
}
      </div>
    )
  }
  if(!edytowany){
  return (
    <div>
      <button onClick={()=>{ustawUlubione(true)}}>ulubione</button>
      <select onChange={(e) => setSzukane(e.target.value)}>
        <option value={null}></option>
        {dostepneSkladniki.map((skladnik) => (
            <option key={skladnik} value={skladnik}>
              {skladnik}
            </option>
          ))}
      </select>
      <button onClick={() => SetSort(!sort)}>sortuj po czasie</button>
      <h1>Przepisowanie</h1>
<div>
  <input
    value={tytul}
    onChange={(e) => setTytul(e.target.value)}
    placeholder="tytuł przepisu"
  />

  <select
    value={selectedSkladnik}
    onChange={(e) => setSelectedSkladnik(e.target.value)}
  >
    {dostepneSkladniki.map((skladnik) => (
      <option key={skladnik} value={skladnik}>
        {skladnik}
      </option>
    ))}
  </select>

  <button onClick={addSkladnik}>
    dodaj składnik
  </button>
  <ul>
    {skladniki.map((s, i) => (
      <li key={i}>{s}</li>
    ))}
  </ul>

  <input
    value={kroki}
    onChange={(e) => setKroki(e.target.value)}
    placeholder="kroki"
  />
  <input
    value={czas}
    onChange={(e) => setCzas(e.target.value)}
    placeholder="czas"
  />

  <button onClick={dane}>Utwórz przepis</button>
</div>

      {
      [...tablica()].sort((a, b) => sort ? Number(a.czas) - Number(b.czas) : 0)
      .map((p) => (
        <Przepis 
        przepisy={przepisy} 
        id={p.id} key={p.id} 
        tytul={p.tytul} 
        skladniki={p.skladniki} 
        kroki={p.kroki} 
        czas={p.czas} >
        <button onClick={()=>{usun(p.id)}}>usun</button>
        <button onClick={()=>{edytuj(p.id)}}>edytuj</button>
        <input  type='checkbox'  onChange={() =>
        { polub(p.id); }} 
        checked={p.ulubione} 
        />
        </Przepis>
      ))}
    </div>
  );
}else{
  return(
    <div>
    <h1>Edytowanie przepisu</h1>

    <input 
      id='tytul' 
      value={edytowany.tytul} 
      onChange={(e) => SetEdytowany(prev => ({ ...prev, tytul: e.target.value }))} 
    />
    
    <select
      value={selectedSkladnik}
      onChange={(e) => setSelectedSkladnik(e.target.value)}
    >
      {dostepneSkladniki.map((skladnik) => (
        <option key={skladnik} value={skladnik}>
          {skladnik}
        </option>
      ))}
    </select>

    <button onClick={edytujIngredients}>Dodaj składnik</button>

    <ul>
      {edytowany.skladniki.map((s, i) => (
        <li key={i}>
          {s} 
          <button onClick={() => removeSkladnik(s)}>Usuń</button>
        </li>
      ))}
    </ul>

    <input 
      value={edytowany.kroki} 
      onChange={(e) => SetEdytowany(prev => ({ ...prev, kroki: e.target.value }))}
      placeholder="kroki" 
    />
    <input 
      value={edytowany.czas} 
      onChange={(e) => SetEdytowany(prev => ({ ...prev, czas: e.target.value }))}
      placeholder="czas" 
    />
    
    <button onClick={edycjaDanych}>Zmien dane</button>
  </div>
  )
}

}

export default App;
