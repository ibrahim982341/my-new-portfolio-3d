import { useEffect, useRef, useState } from "react";
import Scene from "./Scene.jsx";
import { data } from "./data.js";

function Reveal(props) {
  var ref = useRef();
  var state = useState(false);
  var shown = state[0];
  var setShown = state[1];
  useEffect(function () {
    var obs = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(ref.current);
    return function () {
      obs.disconnect();
    };
  }, []);
  return (
    <div ref={ref} className={"reveal" + (shown ? " show" : "")}>
      {props.children}
    </div>
  );
}

function Typer(props) {
  var state = useState("");
  var text = state[0];
  var setText = state[1];
  var info = useRef({ word: 0, count: 0, deleting: false, hold: 0 });
  useEffect(function () {
    var id = setInterval(function () {
      var s = info.current;
      var word = props.words[s.word];
      if (s.hold > 0) {
        s.hold--;
        return;
      }
      if (!s.deleting) {
        s.count++;
        if (s.count === word.length) {
          s.deleting = true;
          s.hold = 18;
        }
      } else {
        s.count--;
        if (s.count === 0) {
          s.deleting = false;
          s.word = (s.word + 1) % props.words.length;
        }
      }
      setText(word.slice(0, s.count));
    }, 80);
    return function () {
      clearInterval(id);
    };
  }, []);
  return (
    <span className="typer">
      {text}
      <i className="caret" />
    </span>
  );
}

export default function App() {
  var bar = useRef();
  useEffect(function () {
    function onScroll() {
      var max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      bar.current.style.width = (window.scrollY / max) * 100 + "%";
    }
    window.addEventListener("scroll", onScroll);
    return function () {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div>
      <Scene />
      <div className="progress" ref={bar} />

      <nav className="nav">
        <a href="#top" className="logo">ibrahim.dev</a>
        <div className="links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
          <a href="#journey">Journey</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <header id="top" className="hero">
        <p className="prompt">
          <span className="red">ibrahim@portfolio</span>:~$ whoami
        </p>
        <h1>{data.name}</h1>
        <h2>
          <Typer words={data.roles} />
        </h2>
        <p className="lead">
          BS Software Engineering student building full-stack apps and deep learning systems.
        </p>
        <div className="buttons">
          <a className="btn solid" href="#projects">View projects</a>
          <a className="btn" href="#contact">Get in touch</a>
        </div>
      </header>

      <main>
        <section id="about">
          <Reveal>
            <h3>About me</h3>
            <div className="about">
              <p>{data.bio}</p>
              <div className="stats">
                {data.stats.map(function (s) {
                  return (
                    <div className="stat" key={s.label}>
                      <b>{s.value}</b>
                      <span>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        </section>

        <section id="skills">
          <Reveal>
            <h3>Skills</h3>
            <div className="grid">
              {data.skills.map(function (g) {
                return (
                  <div className="card" key={g.title}>
                    <h4>{g.title}</h4>
                    <div className="tags">
                      {g.items.map(function (t) {
                        return <span className="tag" key={t}>{t}</span>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </section>

        <section id="projects">
          <Reveal>
            <h3>Featured projects</h3>
            <div className="grid two">
              {data.projects.map(function (p) {
                return (
                  <article className="card project" key={p.title}>
                    <div className="num">{p.number} / {p.field}</div>
                    <h4>{p.title}</h4>
                    <p>{p.text}</p>
                    <div className="tags">
                      {p.tech.map(function (t) {
                        return <span className="tag" key={t}>{t}</span>;
                      })}
                    </div>
                    <div className="status"><i className="dot" /> {p.status}</div>
                  </article>
                );
              })}
            </div>
          </Reveal>
        </section>

        <section id="journey">
          <Reveal>
            <h3>Education and experience</h3>
            <div className="timeline">
              <div className="item">
                <span>Education</span>
                <h4>{data.education.title}</h4>
                <p>{data.education.place} · {data.education.detail}</p>
              </div>
              <div className="item">
                <span>Internship</span>
                <h4>{data.experience.title}</h4>
                <p>{data.experience.place} · {data.experience.detail}</p>
              </div>
            </div>
          </Reveal>
        </section>

        <section id="contact">
          <Reveal>
            <h3>Let's build something</h3>
            <div className="card contact">
              <a href={"mailto:" + data.email}>{data.email}</a>
              <a href={"tel:" + data.phone}>{data.phone}</a>
              <a href={data.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href={data.github} target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer>© {new Date().getFullYear()} {data.name}</footer>
    </div>
  );
}
