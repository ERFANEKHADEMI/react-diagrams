import * as React from 'react';
import { BaseWidget, BaseWidgetProps, PortWidget } from '@projectstorm/react-diagrams-core';
import { DefaultPortModel } from './DefaultPortModel';

export interface DefaultPortLabelProps extends BaseWidgetProps {
	model: DefaultPortModel;
}

export interface DefaultPortLabelState {}

export class DefaultPortLabel extends BaseWidget<DefaultPortLabelProps, DefaultPortLabelState> {
	constructor(props) {
		super('srd-default-port', props);
	}

	getClassName() {
		return super.getClassName() + (this.props.model.in ? this.bem('--in') : this.bem('--out'));
	}

	render() {
		var port = <PortWidget node={this.props.model.getParent()} name={this.props.model.name} />;
		var label = <div className="name">{this.props.model.label}</div>;

		return (
			<div {...this.getProps()}>
				{this.props.model.in ? port : label}
				{this.props.model.in ? label : port}
			</div>
		);
	}
}
