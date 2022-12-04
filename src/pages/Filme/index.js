import { useState, useEffect } from "react";
import "./filme-info.css";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"
import { toast } from "react-toastify"

export default function Filme(){
    const {id} = useParams();
    const navigate = useNavigate();
    const [filme, setFilme] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        async function loadFilme(){
            const response = await api.get(`r-api/?api=filmes/${id}`)

            if(response.data.length === 0){
                //tentou acessar com um id que não existe. navego ele para home.
                navigate("/")
                return;
            }

            setFilme(response.data);
            setLoading(false)
        }
        loadFilme()

        return(
            console.log("componente desmontado")
        )

    },[navigate,id])

    function salvaFilme(){
        const minhaLista = localStorage.getItem("filmes")
        let filmesSalvos = JSON.parse(minhaLista) || [];

        //se tiver algum filme salvos com os mesmo id, ignorar.
        const hasFilme = filmesSalvos.some((filmeSalvo)=> filmeSalvo.id === filme.id)

        if(hasFilme){
            toast.info("Você já possui esse filme salvo!")
            
            return;
        }
        filmesSalvos.push(filme);
        localStorage.setItem("filmes", JSON.stringify(filmesSalvos));
        
        toast.success("Filme salvo com sucesso!")
    }

    if(loading){
        return(
            <div className="filmeInfo">
                <h1>Carregando seu filme...</h1>
            </div>
        )
    }
    return( 
        <div className="filmeInfo">
            <h1>{filme.nome}</h1>
            <img src={filme.foto} alt={filme.nome}/>
            <h3>Sinopse<br/><h5>{filme.sinopse}</h5></h3>

            <div className="botoes">
                <button onClick={salvaFilme}>Salvar</button>
                <button>
                    <a target="blank" href={`https://youtube.com/results?search_query=${filme.nome} Trailer`}>
                        Trailer
                    </a>
                </button>
            </div>
        </div>
    )
}