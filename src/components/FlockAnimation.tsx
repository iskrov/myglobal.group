import React, { useEffect, useRef } from 'react';

// Extracted flock animation component scoped for section usage
const FlockAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Vector {
      x: number; y: number; z: number;
      constructor(x: number, y: number, z: number = 0) { this.x = x; this.y = y; this.z = z; }
      add(v: Vector) { this.x += v.x; this.y += v.y; this.z += v.z; return this; }
      sub(v: Vector) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }
      mult(n: number) { this.x *= n; this.y *= n; this.z *= n; return this; }
      div(n: number) { this.x /= n; this.y /= n; this.z /= n; return this; }
      mag() { return Math.hypot(this.x, this.y, this.z); }
      normalize() { const m = this.mag(); if (m > 0) this.div(m); return this; }
      limit(max: number) { if (this.mag() > max) { this.normalize(); this.mult(max); } return this; }
      static dist(a: Vector, b: Vector) { return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z); }
      static random(c: HTMLCanvasElement) { return new Vector(Math.random()*c.width, Math.random()*c.height, Math.random()*2-1); }
      clone() { return new Vector(this.x, this.y, this.z); }
    }

    class Bird {
      position: Vector; velocity: Vector; acceleration: Vector;
      maxSpeed = 3.5; maxForce = 0.2; baseSize = 3 + Math.random()*2; alpha = 0.95;
      wingPhase = Math.random()*Math.PI*2; depth = 0.5; targetDepth = 0.5;
      targetPosition: Vector | null = null; flockId: number;
      constructor(x:number,y:number,z:number=0, flockId:number=0){
        this.position = new Vector(x,y,z);
        this.velocity = new Vector((Math.random()-0.5)*2,(Math.random()-0.5)*2,(Math.random()-0.5)*0.5);
        this.acceleration = new Vector(0,0,0); this.flockId = flockId;
      }
      getApparentSize(){ return this.baseSize*(0.6 + this.depth*0.8); }
      getApparentAlpha(){ return this.alpha*(0.3 + this.depth*0.7); }
      align(birds: Bird[]){ const pr=40; const s=new Vector(0,0,0); let t=0; for(const o of birds){ if(o!==this && o.flockId===this.flockId){ const d=Vector.dist(this.position,o.position); if(d<pr){ s.add(o.velocity); t++; }}} if(t>0){ s.div(t).normalize().mult(this.maxSpeed).sub(this.velocity).limit(this.maxForce);} return s; }
      cohesion(birds: Bird[]){ const pr=40; const s=new Vector(0,0,0); let t=0; for(const o of birds){ if(o!==this && o.flockId===this.flockId){ const d=Vector.dist(this.position,o.position); if(d<pr){ s.add(o.position); t++; }}} if(t>0){ s.div(t).sub(this.position).normalize().mult(this.maxSpeed).sub(this.velocity).limit(this.maxForce);} return s; }
      separation(birds: Bird[]){ const pr=20; const s=new Vector(0,0,0); let t=0; for(const o of birds){ const d=Vector.dist(this.position,o.position); if(o!==this && d<pr){ const diff=this.position.clone().sub(o.position).div(d*d); s.add(diff); t++; }} if(t>0){ s.div(t).normalize().mult(this.maxSpeed).sub(this.velocity).limit(this.maxForce);} return s; }
      seekTarget(){ if(!this.targetPosition) return new Vector(0,0,0); const desired=this.targetPosition.clone().sub(this.position); const d=desired.mag(); if(d<10){ desired.normalize().mult((d/10)*this.maxSpeed*0.1);} else if(d<50){ desired.normalize().mult((d/50)*this.maxSpeed);} else { desired.normalize().mult(this.maxSpeed);} desired.sub(this.velocity).limit(this.maxForce*3); return desired; }
      edges(c: HTMLCanvasElement){ const m=50; if(this.position.x<m) this.acceleration.x += (m-this.position.x)*0.01; else if(this.position.x>c.width-m) this.acceleration.x -= (this.position.x-(c.width-m))*0.01; if(this.position.y<m) this.acceleration.y += (m-this.position.y)*0.01; else if(this.position.y>c.height-m) this.acceleration.y -= (this.position.y-(c.height-m))*0.01; if(this.position.z<-1) this.position.z=-1; if(this.position.z>1) this.position.z=1; }
      flock(birds: Bird[], formationStrength:number){ const a=this.align(birds), co=this.cohesion(birds), se=this.separation(birds), t=this.seekTarget(); if(formationStrength>0.5){ a.mult(0.2); co.mult(0.2); se.mult(0.6); t.mult(6*formationStrength);} else if(formationStrength>0){ a.mult(0.8); co.mult(0.8); se.mult(1.5); t.mult(2*formationStrength);} else { a.mult(1.8); co.mult(2.0); se.mult(2.5); const rf=new Vector((Math.random()-0.5)*0.1,(Math.random()-0.5)*0.1,(Math.random()-0.5)*0.05); this.acceleration.add(rf);} this.acceleration.add(a).add(co).add(se).add(t); }
      update(){ this.velocity.add(this.acceleration).limit(this.maxSpeed); this.position.add(this.velocity); this.acceleration.mult(0); this.targetDepth=(this.position.z+1)/2; this.depth += (this.targetDepth-this.depth)*0.1; const speed=this.velocity.mag(); this.wingPhase += 0.15*(1+speed*0.5); }
      draw(ctx: CanvasRenderingContext2D){ ctx.save(); ctx.translate(this.position.x,this.position.y); const angle=Math.atan2(this.velocity.y,this.velocity.x); ctx.rotate(angle); const size=this.getApparentSize(); const alpha=this.getApparentAlpha(); const isLightMode=document.documentElement.getAttribute('data-theme')==='light'; const depthBrightness=0.7 + this.depth*0.3; ctx.strokeStyle = isLightMode ? `rgba(${30*depthBrightness}, ${70*depthBrightness}, ${200*depthBrightness}, ${alpha*0.8})` : `rgba(${47*depthBrightness}, ${127*depthBrightness}, 255, ${alpha})`; ctx.lineWidth=size*0.25; ctx.lineCap='round'; const wingSpan=size; const wingAngle=0.3 + Math.sin(this.wingPhase)*0.08; ctx.beginPath(); ctx.moveTo(-wingSpan,-wingSpan*wingAngle); ctx.lineTo(0,0); ctx.lineTo(-wingSpan,wingSpan*wingAngle); ctx.stroke(); if(this.depth>0.7){ ctx.shadowColor = isLightMode ? 'rgba(30,70,200,0.3)' : 'rgba(47,127,255,0.4)'; ctx.shadowBlur=size*0.2; ctx.stroke(); } ctx.restore(); }
    }

    const birds: Bird[] = [];
    const birdsPerFlock = 100; const numberOfFlocks = 3;
    const cw = () => canvas.width, ch = () => canvas.height;
    const clamp = (n:number, min:number, max:number) => Math.max(min, Math.min(max, n));

    // Parametric helpers that place points on letters at arbitrary centers/sizes
    const pointOnM = (centerX:number, centerY:number, letterHeight:number, index:number, total:number) => {
      const letterWidth=letterHeight*0.9, strokeJitter=1.5;
      const xLeft=centerX-letterWidth/2, xMid=centerX, xRight=centerX+letterWidth/2, yTop=centerY-letterHeight/2, yBottom=centerY+letterHeight/2;
      const lenLeft=Math.abs(yBottom-yTop), lenDiagL=Math.hypot(xMid-xLeft, yBottom-yTop), lenDiagR=Math.hypot(xRight-xMid,yBottom-yTop), lenRight=lenLeft; const lengths=[lenLeft,lenDiagL,lenDiagR,lenRight]; const totalLen=lengths.reduce((a,b)=>a+b,0); let counts=lengths.map(l=>Math.max(1,Math.round((l/totalLen)*total))); let allocated=counts.reduce((a,b)=>a+b,0); while(allocated!==total){ const delta=total-allocated; const idx=counts.indexOf(Math.max(...counts)); counts[idx]+=Math.sign(delta); allocated=counts.reduce((a,b)=>a+b,0);} const [c0,c1,c2,c3]=counts; let x=centerX,y=centerY,t=0; if(index<c0){ t=index/Math.max(1,c0-1); x=xLeft; y=yBottom - t*(yBottom-yTop);} else if(index<c0+c1){ const i=index-c0; t=i/Math.max(1,c1-1); x=xLeft + t*(xMid-xLeft); y=yTop + t*(yBottom-yTop);} else if(index<c0+c1+c2){ const i=index-c0-c1; t=i/Math.max(1,c2-1); x=xMid + t*(xRight-xMid); y=yBottom - t*(yBottom-yTop);} else { const i=index-c0-c1-c2; t=i/Math.max(1,c3-1); x=xRight; y=yTop + t*(yBottom-yTop);} x += (Math.random()-0.5)*strokeJitter; y += (Math.random()-0.5)*strokeJitter; return new Vector(x,y,0);
    };
    const pointOnG = (centerX:number, centerY:number, radius:number, index:number, total:number) => {
      const jitter=1.5; const startAngle=(Math.PI)/6, endAngle=(2*Math.PI)-(Math.PI/6); const arcLength=radius*(endAngle-startAngle); const barY=centerY; const barStartX=centerX - radius*0.25; const barEndX=centerX + radius*0.65; const barLength=Math.abs(barEndX-barStartX); const vertX=barEndX, vertTopY=barY, vertBottomY=barY+radius*0.55; const vertLength=Math.abs(vertBottomY-vertTopY); const lengths=[arcLength,barLength,vertLength]; const totalLen=lengths.reduce((a,b)=>a+b,0); let counts=lengths.map(l=>Math.max(1,Math.round((l/totalLen)*total))); let allocated=counts.reduce((a,b)=>a+b,0); while(allocated!==total){ const delta=total-allocated; const idx=counts.indexOf(Math.max(...counts)); counts[idx]+=Math.sign(delta); allocated=counts.reduce((a,b)=>a+b,0);} const [cArc,cBar,cVert]=counts; let x=centerX, y=centerY; if(index<cArc){ const t=index/Math.max(1,cArc-1); const angle=startAngle + t*(endAngle-startAngle); x=centerX + Math.cos(angle)*radius; y=centerY + Math.sin(angle)*radius; } else if(index<cArc+cBar){ const i=index-cArc; const t=i/Math.max(1,cBar-1); x=barStartX + t*(barEndX-barStartX); y=barY; } else { const i=index-cArc-cBar; const t=i/Math.max(1,cVert-1); x=vertX; y=vertTopY + t*(vertBottomY-vertTopY);} x += (Math.random()-0.5)*jitter; y += (Math.random()-0.5)*jitter; return new Vector(x,y,0);
    };

    const init = () => {
      birds.length = 0; const cw2=cw(), ch2=ch();
      for(let flockId=0; flockId<3; flockId++){
        const cx=cw2*(0.25 + flockId*0.25), cy=ch2*0.5;
        for(let i=0;i<birdsPerFlock;i++){
          const angle=(i/birdsPerFlock)*Math.PI*2; const radius=50 + Math.random()*100;
          const x=cx + Math.cos(angle)*radius; const y=cy + Math.sin(angle)*radius; const z=(Math.random()-0.5);
          birds.push(new Bird(x,y,z,flockId));
        }
      }
    };

    const MURMURATION_FRAMES=240, FORMING_FRAMES=90, HOLDING_FRAMES=120, DISPERSING_FRAMES=60;
    // Start in murmuration so we can see the re-forming loop naturally
    let currentPhase: 'murmuration'|'forming'|'holding'|'dispersing' = 'murmuration';
    let phaseTimer=0; let formationStrength=0; let time=0;

    // Assign MGG targets to each flock (hoisted so we can call on phase transitions)
    const assignTargets = () => {
      const width = cw();
      const height = ch();
      const isVertical = width < height * 0.85 || width < 560;

      // Margins and gutters scale with screen size
      const marginH = clamp(width * 0.06, 16, 120);
      const marginV = clamp(height * 0.06, 20, 140);
      // Increased gutters for wider distribution
      const gutterH = clamp(width * 0.08, 18, 200);
      const gutterV = clamp(height * 0.06, 16, 180);

      // Letter geometry coefficients
      const mWidthCoef = 0.9;           // M width = 0.9 * H
      const gWidthCoef = 1.1;           // G width ≈ 1.1 * H (2 * radius, radius = 0.55 * H)
      const rCoef = 0.55;               // radius relative to letter height

      let letterH: number;
      let radius: number;
      let centers: { x:number; y:number }[];

      if (!isVertical) {
        // Horizontal layout: solve for letter height so 3 letters + 2 gutters fit within margins
        const availableWidth = Math.max(50, width - 2 * marginH - 2 * gutterH);
        const maxHByHeight = height * 0.65;
        const maxHByWidth = availableWidth / (mWidthCoef + 2 * gWidthCoef);
        letterH = clamp(Math.min(maxHByHeight, maxHByWidth), 40, height * 0.9);
        // Make letters ~10% smaller for air
        letterH *= 0.9;
        radius = Math.max(30, letterH * rCoef);
        const mW = mWidthCoef * letterH;
        const gW = gWidthCoef * letterH;
        const groupW = mW + 2 * gW + 2 * gutterH;
        const startX = (width - groupW) / 2; // mathematically center the whole trio
        const x1 = startX + mW / 2;
        const x2 = x1 + mW / 2 + gutterH + gW / 2;
        const x3 = x2 + gW / 2 + gutterH + gW / 2;
        const cy = height * 0.5;
        // Optical centering: shift slightly to the right to balance M's visual weight
        const opticalShiftX = letterH * 0.02;
        centers = [ { x: x1 + opticalShiftX, y: cy }, { x: x2 + opticalShiftX, y: cy }, { x: x3 + opticalShiftX, y: cy } ];
      } else {
        // Vertical layout: fit three heights and gutters within top/bottom margins
        const availableHeight = Math.max(60, height - 2 * marginV - 2 * gutterV);
        const maxHByHeight = availableHeight / 3;
        const maxHByWidth = Math.min((width - 2 * marginH) / mWidthCoef, (width - 2 * marginH) / gWidthCoef);
        letterH = clamp(Math.min(maxHByHeight, maxHByWidth), 36, height * 0.4);
        // Make letters ~10% smaller for air
        letterH *= 0.9;
        radius = Math.max(24, letterH * rCoef);
        const groupH = 3 * letterH + 2 * gutterV;
        const startY = (height - groupH) / 2;
        const y1 = startY + letterH / 2;
        const y2 = y1 + letterH + gutterV;
        const y3 = y2 + letterH + gutterV;
        const cx = width * 0.5;
        centers = [ { x: cx, y: y1 }, { x: cx, y: y2 }, { x: cx, y: y3 } ];
      }

      birds.forEach((bird) => {
        const fb = birds.filter(b => b.flockId===bird.flockId);
        const idx = fb.indexOf(bird);
        const c = centers[bird.flockId] || centers[0];
        if (bird.flockId === 0) {
          bird.targetPosition = pointOnM(c.x, c.y, letterH, idx, fb.length);
        } else {
          bird.targetPosition = pointOnG(c.x, c.y, radius, idx, fb.length);
        }
      });
    };

    const updatePhase = () => {
      phaseTimer++;
      switch(currentPhase){
        case 'murmuration':
          if(phaseTimer > MURMURATION_FRAMES){ currentPhase='forming'; phaseTimer=0; assignTargets(); }
          formationStrength = Math.max(0, formationStrength - 0.02); break;
        case 'forming':
          formationStrength = Math.min(1, formationStrength + 0.03);
          if(phaseTimer > FORMING_FRAMES){ currentPhase='holding'; phaseTimer=0; }
          break;
        case 'holding':
          if(phaseTimer > HOLDING_FRAMES){ currentPhase='dispersing'; phaseTimer=0; }
          break;
        case 'dispersing':
          formationStrength = Math.max(0, formationStrength - 0.03);
          if(phaseTimer > DISPERSING_FRAMES){ currentPhase='murmuration'; phaseTimer=0; birds.forEach(b=>{ b.targetPosition=null; }); }
          break;
      }
    };

    const animate = () => {
      const isLight = document.documentElement.getAttribute('data-theme')==='light';
      ctx.fillStyle = isLight ? 'rgba(248, 250, 252, 0.08)' : 'rgba(11, 21, 38, 0.06)';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      time++;
      if(time===1){ assignTargets(); }
      updatePhase();
      birds.sort((a,b)=>a.depth-b.depth);
      birds.forEach(b=>{ b.edges(canvas); b.flock(birds, formationStrength); b.update(); b.draw(ctx); });
      requestAnimationFrame(animate);
    };

    init();
    animate();
    return () => { window.removeEventListener('resize', resizeCanvas); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', zIndex:1, pointerEvents:'none' }}
    />
  );
};

export default FlockAnimation;



