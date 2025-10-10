import { useRef, useState } from 'react';
import { deleteComm, createComm, getListComms, updateCommPassword} from '../api/posts';


function ShowCreateComm(props) {
  const createUsernameRef = useRef();
  const createPasswordRef = useRef();
  const deleteUsernameRef = useRef();

  // 👇 riferimenti per la modifica password
  const updateUsernameRef = useRef();
  const updateOldPasswordRef = useRef();
  const updateNewPasswordRef = useRef();



  const [output, setOutput] = useState('Pronto.');

  const show = (obj) => {
    setOutput(typeof obj === 'string' ? obj : JSON.stringify(obj, null, 2));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const username = createUsernameRef.current.value.trim();
    const password = createPasswordRef.current.value;
    if (!username || !password) return show('Inserisci username e password.');

    show('Creazione in corso…');
    try {
      const res = await createComm(username, password);
      show(res);
      if (res && res.success) e.target.reset();
    } catch (err) {
      show('Errore: ' + (err.message || err));
    }
  };

  const handleView = async () => {
    show('Caricamento utenti…');
    try {
      const users = await getListComms();
      show(users);
    } catch (err) {
      show('Errore: ' + (err.message || err));
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    const username = deleteUsernameRef.current.value.trim();
    if (!username) return show('Inserisci lo username da eliminare.');

    show('Eliminazione in corso…');
    try {
      const res = await deleteComm(username);
      show(res);
      if (res && res.success) e.target.reset();
    } catch (err) {
      show('Errore: ' + (err.message || err));
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    const username = updateUsernameRef.current.value.trim();
    const oldPassword = updateOldPasswordRef.current.value;
    const newPassword = updateNewPasswordRef.current.value;

    if (!username || !oldPassword || !newPassword) {
      return show('Compila tutti i campi per modificare la password.');
    }

    show('Aggiornamento password in corso…');
    try {
      const res = await updateCommPassword(username, oldPassword, newPassword);
      show(res);
      if (res && res.success) e.target.reset();
    } catch (err) {
      show('Errore: ' + (err.message || err));
    }
  };


  return (
    <>
    <style>{`
        body {
          margin: 0;
          padding: 0;
          background: #f2f2f2;
          font-family: system-ui, Arial;
          height: 100vh;
        }

        .wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: #39300D;
          width: 50%;
          max-height: 90vh;
          overflow-y: auto; /* 👈 permette lo scroll se serve */
          color: #D6AD42;
          border-radius: 10px;
          padding: 30px 40px;
          text-align: center;
          box-sizing: border-box;
        }

        .wrapper h1 {
          margin-top: 0;
          font-size: 36px;
        }

        .wrapper h2 {
          font-size: 26px;
          color: #D6AD42;
          margin-bottom: 15px;
        }

        input {
          display: block;
          margin: 8px auto 15px auto;
          padding: 10px;
          width: 60%;
          box-sizing: border-box;
          border-radius: 6px;
          border: none;
        }

        button {
          padding: 10px;
          width: 45%;
          cursor: pointer;
          border: none;
          border-radius: 6px;
          background-color: #D6AD42;
          color: #39300D;
          font-weight: bold;
        }

        button:hover {
          background-color: #EFCB67;
        }

        .card {
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 25px;
        }

        #output {
          white-space: pre-wrap;
          background: #f7f7f7;
          color: #39300D;
          padding: 10px;
          border-radius: 6px;
          min-height: 10vh;
          max-height: 20vh;
          width: 80%;
          margin: 10px auto;
          box-sizing: border-box;
          text-align: left;
          overflow-y: auto;
        }

        .row {
          display: flex;
          justify-content: center;   /* 👈 bottoni in orizzontale */
          gap: 12px;                 /* spazio tra bottoni */
          margin-top: 10px;
        }

        form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
      `}</style>
      <div className="wrapper">
        <h1>Gestione Utenti</h1>

        <h3>Output</h3>
        <pre id="output">{output}</pre>

        <div className="card">
          <h2>Crea utente</h2>
          <form onSubmit={handleCreate}>
            <input ref={createUsernameRef} type="text" placeholder="Username" required />
            <input ref={createPasswordRef} type="text" placeholder="Password" required />
            <div className="row">
              <button type="submit">Crea Utente</button>
            </div>
          </form>
        </div>

        <div className="card">
          <h2>Visualizza utenti</h2>
          <div className="row">
            <button onClick={handleView} style={{width:"30%"}}>Mostra utenti</button>
          </div>
        </div>

        <div className="card">
          <h2>Elimina utente</h2>
          <form onSubmit={handleDelete}>
            <input ref={deleteUsernameRef} type="text" placeholder="Username da eliminare" required />
            <div className="row">
              <button type="submit">Elimina Utente</button>
            </div>
          </form>
        </div>
        <div className="card">
          <h2>Modifica password utente</h2>
          <form onSubmit={handleUpdate}>
            <input ref={updateUsernameRef} type="text" placeholder="Username" required />
            <input ref={updateOldPasswordRef} type="text" placeholder="Vecchia password" required />
            <input ref={updateNewPasswordRef} type="text" placeholder="Nuova password" required />
            <div className="row">
              <button type="submit">Aggiorna Password</button>
            </div>
          </form>
        </div>
        <button onClick={()=>props.setPage("home")}>Torna alla home</button>
      </div>
    </>
  );
}

export { ShowCreateComm };