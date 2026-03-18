'use client';

interface Props { markdown: string; }

export default function CVPreview({ markdown }: Props) {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  const inline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);
    return parts.map((p, j) => {
      if (p.startsWith('**') && p.endsWith('**')) return <strong key={j}>{p.slice(2,-2)}</strong>;
      if (p.startsWith('*')  && p.endsWith('*'))  return <em key={j}>{p.slice(1,-1)}</em>;
      if (p.startsWith('`')  && p.endsWith('`'))  return <code key={j} style={{background:'#f0f0f0',padding:'1px 4px',borderRadius:'3px',fontSize:'11px'}}>{p.slice(1,-1)}</code>;
      return p;
    });
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={i} style={{fontSize:'22px',fontWeight:'700',fontFamily:'Georgia,serif',color:'#0A2540',borderBottom:'2px solid #0A2540',paddingBottom:'7px',marginBottom:'4px',marginTop:'0'}}>
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} style={{fontSize:'10px',fontWeight:'700',textTransform:'uppercase',letterSpacing:'.12em',color:'#0D7C66',borderBottom:'1px solid #DDD',paddingBottom:'3px',marginTop:'20px',marginBottom:'10px'}}>
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} style={{fontSize:'13px',fontWeight:'600',color:'#1a1a2e',marginTop:'10px',marginBottom:'2px'}}>
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        items.push(lines[i].slice(2));
        i++;
      }
      elements.push(
        <ul key={`ul${i}`} style={{paddingLeft:'16px',marginBottom:'8px'}}>
          {items.map((it,j)=>(
            <li key={j} style={{fontSize:'11.5px',color:'#333',marginBottom:'3px',lineHeight:'1.5'}}>{inline(it)}</li>
          ))}
        </ul>
      );
      continue;
    } else if (line.trim()==='---') {
      elements.push(<hr key={i} style={{border:'none',borderTop:'1px solid #e0e0e0',margin:'10px 0'}}/>);
    } else if (line.trim()==='') {
      elements.push(<div key={i} style={{height:'5px'}}/>);
    } else {
      const isKV = /^(Date of Birth|State of Origin|Nationality|Marital Status|NYSC|Phone|Email|Address|LinkedIn|GitHub|Portfolio)\s*:/i.test(line.trim());
      elements.push(
        <p key={i} style={{fontSize:'11.5px',color: isKV ? '#1a1a2e' : '#333',fontWeight: isKV ? 500 : 400,lineHeight:'1.6',marginBottom: isKV ? '2px' : '5px'}}>
          {inline(line)}
        </p>
      );
    }
    i++;
  }

  return (
    <div style={{fontFamily:'Georgia,serif',color:'#1a1a2e',lineHeight:'1.55'}}>
      {elements}
    </div>
  );
}
