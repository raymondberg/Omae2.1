import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../ModalButtonComponent';
import FilterTable from '../FilterableTable';
import DisplayTable from '../DisplayTableComponent';
import GearTableRow from './GearTableDisplayRow';

class GearComponent extends React.PureComponent {
	constructor(props) {
		super(props);

		this.purchaseGearAction = this.purchaseGearAction.bind(this);
	}
	componentWillMount() {
		const {gearData, category} = this.props,
			gearRows = gearData.map((gear) => {
				return (
					<GearTableRow
						key={`gear-to-buy--${gear.name}`}
						gear={gear}
						btnClass="btn-success"
						btnSymbol="+"
						btnAction={this.purchaseGearAction}
					/>
				);
			});

		this.gearModal = (
			<Modal
				modalName={category}
				modalContent={
					<FilterTable
						tableData={{
							header: <GearTableHeader />,
							body: gearRows
						}}
					/>
				}
			/>
		);
	}

	purchaseGearAction({gear, state}) {
		return () => {
			const Rating = (state.rating === null) ? null : state.rating || 1;

			this.props.purchaseGear({
				gear: (state.currentCost === null) ? gear : {...gear, cost: state.currentCost},
				category: gear.category,
				Rating
			});
		};
	}

	render() {
		return this.gearModal;
	}
}

GearComponent.propTypes = {
	gearData: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			category: PropTypes.string.isRequired,
			avail: PropTypes.string.isRequired,
			cost: PropTypes.string.isRequired,
			source: PropTypes.string.isRequired,
			page: PropTypes.string.isRequired,
		}).isRequired
	).isRequired,
	category: PropTypes.string.isRequired,
	purchaseGear: PropTypes.func.isRequired
};

GearComponent.defaultProps = {
	purchased: null
};

function GearTableHeader() {
	return (
		<tr>
			<th>Buy</th>
			<th>Name</th>
			<th>Rating</th>
			<th>Avail</th>
			<th>&yen;</th>
			<th>Ref</th>
		</tr>
	);
}

function PurchasedGear({purchased, sellGear, category}) {
	const gearTableRow = purchased.map((gear, index) => {
		return (
			<GearTableRow
				key={`${gear.name + index}-purchased`}
				gear={gear}
				btnClass="btn-warning"
				btnSymbol="-"
				btnAction={() => {
					return () => {
						sellGear({index, category});
					};
				}}
			/>
		);
	});

	return (
		<div className="table-responsive purchased-gear">
			<h4>{category}</h4>
			<DisplayTable
				header={<GearTableHeader />}
				body={gearTableRow} />
		</div>
	);
}

PurchasedGear.propTypes = {
	sellGear: PropTypes.func.isRequired,
	category: PropTypes.string.isRequired,
	purchased: PropTypes.arrayOf(PropTypes.object.isRequired)
};

PurchasedGear.defaultProps = {
	purchased: []
};

export {PurchasedGear};

export default GearComponent;
