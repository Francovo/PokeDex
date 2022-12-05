import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import '../../styles/Home.scss';
import axios from 'axios';
import { ImStack, ImSearch } from 'react-icons/im';
import { GrClose } from 'react-icons/gr';

//Estado para el uso del LazyLoading
const Pokemons = lazy(() => import('./Pokemons'));

const Home = () => {
	const [pokemons, setPokemons] = useState([]);
	const [dataPokemon, setDataPokemon] = useState([]);
	let objectDetail = [];

	//Estado de espera al iniciar Pagina
	const [count, setCount] = useState(0);
	const Timer = () => {
		const timer = setTimeout(() => {
			setCount('Timeout called!');
		}, 1000);
		console.log('Se hizo el reinicio');
		return () => clearTimeout(timer);
	};

	//Get del pokemon por el url de detalles
	const GetPokemon = (imgurls, actionType) => {
		if (actionType === 'getAll')
			imgurls.map((element) => {
				axios.get(element).then((response) => {
					objectDetail.push({
						id: response.data.id,
						img: response.data.sprites.other['official-artwork'].front_default,
						name: response.data.name,
						types: response.data.types,
						height: response.data.height,
						weight: response.data.weight,
						abilities: response.data.abilities,
					});
					setDataPokemon(objectDetail);
				});
			});
		//Data de los nombres
		if (actionType === 'name') {
			objectDetail.push({
				id: imgurls.id,
				img: imgurls.sprites.other['official-artwork'].front_default,
				name: imgurls.name,
				types: imgurls.types,
				height: imgurls.height,
				weight: imgurls.weight,
				abilities: imgurls.abilities,
			});
			setDataPokemon(objectDetail);
		}
		//Data de los tipos
		if (actionType === 'type') {
			imgurls.map((element) => {
				axios.get(element.pokemon.url).then((response) => {
					objectDetail.push({
						id: response.data.id,
						img: response.data.sprites.other['official-artwork'].front_default,
						name: response.data.name,
						types: response.data.types,
						height: response.data.height,
						weight: response.data.weight,
						abilities: response.data.abilities,
					});
					setDataPokemon(objectDetail);
				});
			});
			// console.log('Url de tipos de pokemon', imgurls);
		}
	};

	//Actualizacion de estado de busqueda por tipo
	const [Type, setType] = useState('');
	const [Name, setName] = useState(null);
	console.log('NAME', Name);

	// console.log('clg NAME', Name);
	const GetByName = (Name) => {
		console.log('NAME fun : GETBYNAME', Name);
		axios
			.get(`https://pokeapi.co/api/v2/pokemon/${Name}`)
			.then((response) => {
				let imgurls = response.data;
				GetPokemon(imgurls, 'name');
			})
			.catch((error) => {
				console.log('Peticion no lograda', error);
				alert('El nombre ingresado no existe');
			});
		Timer();
	};

	const GetByType = (Type) => {
		axios
			.get(`https://pokeapi.co/api/v2/type/${Type}`)
			.then((response) => {
				let imgurls = response.data.pokemon;
				GetPokemon(imgurls, 'type');
			})
			.catch((error) => {
				console.log('Peticion no lograda', error);
				alert('El tipo ingresado no existe');
			});
		Timer();
	};

	//Get de todos los pokemon y FILTRO DE BUSQUEDAS
	const GetData = () => {
		if (typeof Type === 'string') {
			dataPokemon([]);
		}
		if (typeof Name === 'string') {
			dataPokemon([]);
			GetByName(Name);
		}
		if (typeof Name === 'string' && typeof Type === 'string') {
			GetByType(Type);
			GetByName(Name);
		}
	};

	function handleSubmit(e) {
		e.preventDefault();
		if (Name) GetByName(Name);
		if (Type) GetByType(Type);
	}

	useEffect(() => {
		Timer();
	}, []);

	useEffect(() => {
		axios
			.get('https://pokeapi.co/api/v2/pokemon')
			.then((response) => {
				let imgurls = response.data.results.map((element) => {
					return element.url;
				});
				GetPokemon(imgurls, 'getAll');
			})
			.catch((error) => {
				console.log('Peticion no lograda', error);
			});
	}, []);

	return (
		<div>
			{/* Si el estado de Pokemons fue actualizado y contiene 
			informacion se ejecuta el codigo */}
			{pokemons ? (
				<div className="ContainerHome">
					<button
						className="Logo"
						onClick={() => {
							window.location.reload(true);
						}}>
						<h1>U M B R A</h1> <br />
						<h2>3D.STUDIO</h2>
					</button>
					<div className="Container_NavBar">
						<form onSubmit={handleSubmit} className="NavBar">
							<div className="ContainerInput">
								<input placeholder="Tipo" name="Type" id="Type" onChange={(e) => setType(e.target.value)} />
								<button
									className="BtnDelete"
									onClick={() => {
										document.querySelector('#Type').value = '';
									}}>
									<GrClose />
								</button>
							</div>
							<div className="ContainerInput">
								<input placeholder="Nombre" name="Name" id="Name" onChange={(e) => setName(e.target.value)} />
								<button
									className="BtnDelete"
									onClick={() => {
										document.querySelector('#Name').value = '';
									}}>
									<GrClose />
								</button>
							</div>
							<button className="Btn_Search" type={'submit'}>
								<ImSearch />
							</button>
						</form>
					</div>

					<div className="ContainerBtnDesign">
						<button className="BtnDesign">
							<ImStack
								onClick={() => {
									const classContainerPokemon = document.querySelectorAll('.ContainerPokeImg');
									classContainerPokemon.forEach((element) => {
										element.classList.toggle('ContainerPokeImg2');
									});
								}}
							/>
						</button>
					</div>

					<div className="ContainerCardPokemon">
						<Suspense fallback={<h1>Cargando...</h1>}>
							<Pokemons data={dataPokemon} />
						</Suspense>
					</div>

					<div className="ContainerFooter">
						<button className="BtnMore">Show More</button>
						<img alt="" src="https://res.cloudinary.com/aca-geek/image/upload/v1670039007/Imagen_de_WhatsApp_2022-12-02_a_las_22.43.17_yhrer4.jpg" className="ImgFooter" />
					</div>
				</div>
			) : (
				<div>NO HAY POKEMONS</div>
			)}
		</div>
	);
};

export default Home;
