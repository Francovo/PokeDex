import React, { useEffect, useState } from 'react';
import '../../styles/Pokemon.scss';
import { ModalDetails } from '../Details/Modal_Details';

const Pokemons = ({ data }) => {
	const [DetailsPoke, setDetailsPoke] = useState(null);

	//Estado de espera al iniciar Pagina
	const [count, setCount] = useState(0);

	console.log('Data de Pokemon', data);
	return (
		<div className="ContainerPokeImg">
			<ModalDetails
				Pokemon={DetailsPoke}
				isOpen={DetailsPoke !== null}
				onClose={() => {
					setDetailsPoke(null);
				}}
			/>

			{data.map((pokemon, index) => (
				<img
					key={`nombre-${pokemon.name}`}
					alt=""
					src={pokemon.img}
					onClick={() => {
						setDetailsPoke(pokemon);
					}}
					className="PokeImg"></img>
			))}
		</div>
	);
};

export default Pokemons;
