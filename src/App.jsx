import { useState, useEffect } from 'react';
import './App.css';

function Przepis({tytul , skladniki , kroki , czas , children,operation}) { 
  return (
    <div className='karta'>
      <button onClick={operation}>
        <img  src="/search.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }} />
      </button>
      <div className='header'>
        <h2 className='tytul'>{tytul}</h2>
        <p className='czas'>{czas + " min"}</p>
      </div>
      <h3>Składniki:</h3>
      <div>
        {skladniki.map((skladnik, index) => (
          <p key={index}>-{skladnik}</p>
        ))}
      </div>
      <p>{kroki}</p>
      <div>
        {children}
      </div>
    </div>
  );
}

function Sort({state , operation}){
  if(!state){
    return(
      <button onClick={operation}>
      <img  src="/sort-down.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }} />
      </button>
    )
  }else{
    return(
      <button onClick={operation}>
      <img  src="/x-circle.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }}></img>
      </button>
    )
  }
}
function Star({state , operation}){
  if(state){
    return(
      <button onClick={operation}>
        <img  src="/star-fill.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }} />
      </button>
      
    )
  }else{
    return(
      <button onClick={operation}>
        <img src="/star.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }}></img>
      </button>
    )
  }
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
    if (tytul && tytul.trim() !== "") {
      if (Array.isArray(skladniki) && skladniki.length > 0) {
        if (kroki && kroki.trim() !== "") {  // Fixed this to use kroki, not title.kroki()
          if (!isNaN(czas) && czas >= 0) {
            const nowy = { 
              id: nextId, 
              tytul: tytul,    // Assuming you meant to use title here
              skladniki, 
              kroki, 
              czas, 
              ulubione: false 
            };
            setPrzepisy([...przepisy, nowy]);
            setNextId(nextId + 1); // Update nextId after adding a new recipe
            setTytul('');
            setKroki('');
            setSkladniki([]);
            setCzas('');
          }
        }
      }
    }
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

    if (edytowany.tytul && edytowany.tytul.trim() !== "") {
      if (Array.isArray(edytowany.skladniki) && edytowany.skladniki.length > 0) {
        if (edytowany.kroki && edytowany.kroki.trim() !== "") {  // Fixed this to use kroki, not title.kroki()
          if (!isNaN(edytowany.czas) && edytowany.czas >= 0) {
            let tab=[];
            let nowy
            for(let i=0;i<przepisy.length;i++){
              if(edytowany.id == przepisy[i].id){
                nowy = { id: edytowany.id, tytul: edytowany.tytul, skladniki: edytowany.skladniki , kroki: edytowany.kroki , czas: edytowany.czas , ulubione: edytowany.ulubione};
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
        }
      }
    }
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
function removeSkladnikDodawanie(ktory){
    setSkladniki(skladniki.filter(skladnik => skladnik !== ktory))
}
const [wybranyElement, setElement] = useState(null);
  if(wybranyElement){
    return(
      <div className='caly'>
      <Przepis 
        przepisy={przepisy} 
        id={wybranyElement.id} key={wybranyElement.id} 
        tytul={wybranyElement.tytul} 
        skladniki={wybranyElement.skladniki} 
        kroki={wybranyElement.kroki} 
        czas={wybranyElement.czas} >
        <button onClick={()=>{usun(wybranyElement.id)}}><img src="/trash3-fill.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }} ></img> </button>
        <button onClick={()=>{edytuj(wybranyElement.id)}}><img src="/pen.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }} ></img></button>
        <Star state={wybranyElement.ulubione} operation={()=>{polub(wybranyElement.id)}} ></Star>
        </Przepis>
      </div>
    )
  }
  if(czyUlubione && !edytowany){
    return(
      <div>
        <Star state={czyUlubione} operation={()=>{ustawUlubione(false)}}></Star>
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
      <button onClick={() => {usun(p.id)}}><img src="/trash3-fill.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }} ></img></button>
      <button onClick={() => {edytuj(p.id)}}><img src="/pen.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }} ></img></button>
      <Star state={p.ulubione} operation={()=>{polub(p.id)}} ></Star>
    </Przepis>
  ))
}
      </div>
    )
  }
  if(!edytowany){
  return (
    <div>
       <Star state={czyUlubione} operation={()=>{ustawUlubione(true)}}></Star>
      <select onChange={(e) => setSzukane(e.target.value)}>
        <option value={null}></option>
        {dostepneSkladniki.map((skladnik) => (
            <option key={skladnik} value={skladnik}>
              {skladnik}
            </option>
          ))}
      </select>
      <Sort operation={() => SetSort(!sort)} state={sort}></Sort>
      <h1>Przepisowanie</h1>
<div className='dodawanie'>
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
      <li key={i}>{s}<button onClick={()=>{removeSkladnikDodawanie(s)}}><img src="/trash3-fill.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }} ></img></button></li>
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
        operation={()=>{setElement(p)}}
        przepisy={przepisy} 
        id={p.id} key={p.id} 
        tytul={p.tytul} 
        skladniki={p.skladniki} 
        kroki={p.kroki} 
        czas={p.czas} >
        <button onClick={()=>{usun(p.id)}}><img src="/trash3-fill.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }} ></img> </button>
        <button onClick={()=>{edytuj(p.id)}}><img src="/pen.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }} ></img></button>
        <Star state={p.ulubione} operation={()=>{polub(p.id)}} ></Star>
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
          <button onClick={() => removeSkladnik(s)}><img src="/trash3-fill.svg" alt="Sort Icon" style={{ width: '25px', height: '25px' }} ></img></button>
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
