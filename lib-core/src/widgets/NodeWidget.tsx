import * as React from 'react';
import * as _ from 'lodash';
import { DiagramEngine } from '../DiagramEngine';
import { NodeModel } from '../models/NodeModel';
import { BaseWidget, BaseWidgetProps } from './BaseWidget';
import { BaseEntityEvent } from '../core-models/BaseEntity';
import { BaseModel } from '../core-models/BaseModel';
import { ListenerHandle } from '../core/BaseObserver';
import { PeformanceWidget } from './PeformanceWidget';

export interface NodeProps extends BaseWidgetProps {
	node: NodeModel;
	children?: any;
	diagramEngine: DiagramEngine;
}

export class NodeWidget extends BaseWidget<NodeProps> {
	ob: any;
	ref: React.RefObject<HTMLDivElement>;
	listener: ListenerHandle;

	constructor(props: NodeProps) {
		super('srd-node', props);
		this.ref = React.createRef();
	}

	getClassName() {
		return 'node ' + super.getClassName() + (this.props.node.isSelected() ? this.bem('--selected') : '');
	}

	componentWillUnmount(): void {
		this.ob.disconnect();
		this.ob = null;
	}

	componentDidUpdate(prevProps: Readonly<NodeProps>, prevState: Readonly<any>, snapshot?: any): void {
		if (this.listener && this.props.node !== prevProps.node) {
			this.listener.deregister();
			this.installSelectionListener();
		}
	}

	installSelectionListener() {
		this.listener = this.props.node.registerListener({
			selectionChanged: (event: BaseEntityEvent<BaseModel> & { isSelected: boolean }) => {
				this.forceUpdate();
			}
		});
	}

	componentDidMount(): void {
		// @ts-ignore
		this.ob = new ResizeObserver(entities => {
			const bounds = entities[0].contentRect;
			this.props.node.updateDimensions({ width: bounds.width, height: bounds.height });

			//now mark the links as dirty
			_.forEach(this.props.node.getPorts(), port => {
				port.updateCoords(this.props.diagramEngine.getPortCoords(port));
			});
		});
		this.ob.observe(this.ref.current);
		this.installSelectionListener();
	}

	render() {
		return (
			<PeformanceWidget serialized={this.props.node.serialize()}>
				{() => {
					return (
						<div
							ref={this.ref}
							{...this.getProps()}
							data-nodeid={this.props.node.getID()}
							style={{
								top: this.props.node.getY(),
								left: this.props.node.getX()
							}}>
							{this.props.diagramEngine.generateWidgetForNode(this.props.node)}
						</div>
					);
				}}
			</PeformanceWidget>
		);
	}
}
