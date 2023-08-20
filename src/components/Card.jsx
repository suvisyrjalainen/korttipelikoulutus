import '../App.css';

export default function Card({card, selected, handleSelect}) {
    if (!card) return <div className="card" />;
    
    return (
        <div className="card">
        <img src={card.image} alt="" draggable="false" />
        <ul className="kissan_lista">
        {card.ominaisuudet.map((listaelementti, index) => (
          <li 
            className={`kissan_ominaisuus${selected === index ? ' valittu' : ''}`}
            onClick={() => handleSelect && handleSelect(index)}
            key={index}>
            <span>{listaelementti.name}</span>
            <span>{listaelementti.value}</span>
          </li>
        ))}
        </ul>
      </div>
    );
}