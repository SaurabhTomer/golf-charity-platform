const CharityCard = ({ charity, onSelect, selected }) => {
  return (
    <div style={{
      border: selected ? '2px solid green' : '1px solid #ddd',
      borderRadius: '8px',
      padding: '16px',
      cursor: 'pointer',
      position: 'relative'
    }}
      onClick={() => onSelect(charity.id)}
    >
      {charity.is_featured && (
        <span style={{
          position: 'absolute', top: '8px', right: '8px',
          background: 'gold', padding: '2px 8px',
          borderRadius: '4px', fontSize: '12px'
        }}>
          Featured
        </span>
      )}

      {charity.logo_url && (
        <img
          src={charity.logo_url}
          alt={charity.name}
          style={{ width: '60px', height: '60px', objectFit: 'contain', marginBottom: '8px' }}
        />
      )}

      <h3 style={{ margin: '0 0 8px' }}>{charity.name}</h3>
      <p style={{ color: 'gray', fontSize: '14px', margin: 0 }}>{charity.description}</p>

      {selected && (
        <p style={{ color: 'green', fontWeight: 'bold', marginTop: '8px' }}>✓ Selected</p>
      )}
    </div>
  );
};

export default CharityCard;